<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Monaco, Editor } from "./types";
  import { detectSystemTheme, watchSystemThemeChanges } from "$lib/theme";
  import { browser } from "$app/environment";
  import { getCompletionsProvider } from "./completionsProvider";
  import Env from "$lib/components/Env/component.svelte";
  import type { Entry } from "$lib/files";

  interface CodetoyModel {
    model: Editor.ITextModel;
    entry: Entry;
  }
  let models: { [key: string]: CodetoyModel } = {};
  let active: CodetoyModel | undefined;

  let {
    monaco = $bindable() as typeof Monaco | undefined,
    editor = $bindable() as Editor.IStandaloneCodeEditor | undefined,
    mounted = undefined as
      | ((monaco: typeof Monaco, editor: Editor.IStandaloneCodeEditor) => Promise<void>)
      | undefined,
    updated,
    saveChanges,
    saved,
    edited,
    ...props
  }: {
    class?: string;
    editor?: Editor.IStandaloneCodeEditor;
    monaco?: typeof Monaco;
    updated?: (code: string) => void;
    saveChanges?: (code: string) => void;
    saved?: (model: Editor.ITextModel, entry: Entry) => void;
    edited?: () => void;
    mounted?: (
      monaco: typeof Monaco,
      editor: Editor.IStandaloneCodeEditor
    ) => Promise<void>;
  } = $props();
  let editorContainer: HTMLElement;

  let completionProviderDisposable: { dispose(): void } | undefined;

  function getEditorLang(env: "as" | "csharp" | "lua") {
    if (env === "lua") return "lua";
    else if (env === "csharp") return "csharp";
    else return "typescript";
  }

  export async function initialize(env: "as" | "csharp" | "lua", getIframe: () => Env | undefined) {
    
    const language: "lua" | "csharp" | "typescript" = getEditorLang(env)
    
    if (!monaco) {
      monaco = (await import("./instance")).default;
    }

    if (!editor) {

      editor = monaco!.editor.create(editorContainer, {
        padding: {
          top: 16
        },
        automaticLayout: true,
        theme: detectSystemTheme() === 'light' ? "vscode-light-plus" : 'vscode-dark-plus',
        minimap: {
          enabled: false,
        },
        language: language,
        autoIndent: "full",
        formatOnPaste: true,
        formatOnType: true,
        bracketPairColorization: {
          enabled: false,
        },
        scrollBeyondLastLine: true,
        lineNumbersMinChars: 4,
        fontSize: 12,
      });

      watchSystemThemeChanges((theme) => {
        monaco?.editor.setTheme(theme === 'light' ? "vscode-light-plus" : 'vscode-dark-plus');
      })

      const { KeyCode, KeyMod } = await import("$lib/components/CodeEditor/types");

      editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyR, () => {
        editor!.trigger("keyboard", "editor.action.rename", null);
      });

      editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
        if (active) saveFile(active);
        else if (editor) saveChanges?.(editor.getValue());
      });

      const completionsProvider = getCompletionsProvider(env, getIframe)

      completionProviderDisposable = monaco.languages.registerCompletionItemProvider("csharp", {
        triggerCharacters: [".", "("],
        completionsProvider
      });

      await loadMonacoSetup(env);
    }

    setResponsiveFontSize();
    window.addEventListener("resize", setResponsiveFontSize);

    if (mounted) {
      await mounted(monaco!, editor);
    }
    
  }


  export function resetMonaco() {
    if (!editor || !monaco) return;

    completionProviderDisposable?.dispose();
    completionProviderDisposable = undefined;

    // Dispose file models tracked in our registry
    for (const key of Object.keys(models)) { models[key].model.dispose(); }
    models = {};
    active = undefined;

    // Dispose all remaining models so stale declaration/sketch models don't linger
    for (const model of monaco.editor.getModels()) {
      model.dispose();
    }

    // Detach the editor from the now-disposed model
    editor.setModel(null);
  }

  export async function loadMonacoSetup(targetEnv: "csharp" | "lua" | "as") {
    if (!editor || !monaco) return;

    if (targetEnv === "as") {
      const [indexSrc, canvasSrc, timeSrc, screenSrc, inputSrc] =
        await Promise.all([
          import("@codetoy-io/bindings.web/assembly/index.ts?raw"),
          import("@codetoy-io/bindings.web/assembly/canvas.ts?raw"),
          import("@codetoy-io/bindings.web/assembly/time.ts?raw"),
          import("@codetoy-io/bindings.web/assembly/screen.ts?raw"),
          import("@codetoy-io/bindings.web/assembly/input.ts?raw"),
        ]).then((mods) => mods.map((m) => m.default));

      const declarations = [
        { filePath: "assembly/index.d.ts", content: indexSrc },
        { filePath: "node_modules/codetoy/canvas.d.ts", content: canvasSrc },
        { filePath: "node_modules/codetoy/screen.d.ts", content: screenSrc },
        { filePath: "node_modules/codetoy/input.d.ts", content: inputSrc },
        { filePath: "node_modules/codetoy/time.d.ts", content: timeSrc },
      ];

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        // Fix: tell TS where to find the codetoy/* modules
        paths: {
          "codetoy/*": ["node_modules/codetoy/*.d.ts"],
        },
      });

      monaco.languages.typescript.typescriptDefaults.setExtraLibs(declarations);

      // Register declaration files as models so TS can resolve them
      for (const { filePath, content } of declarations) {
        const uri = new monaco.Uri().with({ path: filePath });
        if (!monaco.editor.getModel(uri)) {
          monaco.editor.createModel(content, "typescript", uri);
        }
      }
    }

    // Always re-attach the content change listener
    editor.onDidChangeModelContent((e: Editor.IModelContentChangedEvent) => {
      if (!e.isFlush) edited?.();
      updated?.(editor!.getValue());
    });
  }

  const DEFAULT_FONT_SIZE = 12;

  const setResponsiveFontSize = () => {
    if (!editor) return;
    const w = window.innerWidth;
    if (w < 600) {
      editor.updateOptions({ fontSize: 8 });
    } else if (w < 800) {
      editor.updateOptions({ fontSize: 10 });
    } else if (w < 1200) {
      editor.updateOptions({ fontSize: 12 });
    }
  };

  export function getScaleFactor(): number {
    const w = window.innerWidth;
    const fontSize = w < 600 ? 8 : w < 800 ? 10 : DEFAULT_FONT_SIZE;
    return fontSize / DEFAULT_FONT_SIZE;
  }

  onDestroy(() => {
    if (!browser) return;
    window.removeEventListener("resize", setResponsiveFontSize);
  });

  export function clearAllModels() {
    for (const key of Object.keys(models)) { models[key].model.dispose(); }
    models = {};
    active = undefined;
    monaco?.editor.getModels().forEach((model: any) => model.dispose());
    editor?.dispose();
  }

  export async function loadAllModels(rootEntry: Entry): Promise<void> {
    if (!monaco || !editor) return;
    for (const key of Object.keys(models)) models[key].model.dispose();
    models = {};
    active = undefined;
    const loads: Promise<void>[] = [];
    function recurse(entry: Entry) {
      if (entry.kind === "file") loads.push(loadModel(entry));
      if (entry.entries) for (const child of Object.values(entry.entries)) recurse(child);
    }
    recurse(rootEntry);
    await Promise.all(loads);
  }

  export async function select(entry: Entry): Promise<void> {
    if (!monaco || !editor || entry.kind !== "file") return;
    if (!models[entry.relativePath]) await loadModel(entry);
    const cm = models[entry.relativePath];
    if (!cm) return;
    active = cm;
    editor.setModel(cm.model);
  }

  async function loadModel(entry: Entry): Promise<void> {
    if (!monaco || !editor || entry.kind !== "file") return;
    const handle = entry.handle as FileSystemFileHandle;
    const content = await (await handle.getFile()).text();
    const name = entry.name;
    let language = "plaintext";
    if (name.endsWith(".ts")) language = "typescript";
    else if (name.endsWith(".cs")) language = "csharp";
    else if (name.endsWith(".lua")) language = "lua";
    else if (name.endsWith(".js")) language = "javascript";
    const uri = new monaco!.Uri().with({ path: entry.relativePath });
    let model = monaco!.editor.getModel(uri);
    if (!model) model = monaco!.editor.createModel(content, language, uri);
    else model.setValue(content);
    if (language === "typescript") {
      monaco!.languages.typescript.typescriptDefaults.addExtraLib(
        content, `file://${entry.relativePath}`
      );
    }
    models[entry.relativePath] = { model, entry };
  }

  async function saveFile(cm: CodetoyModel): Promise<void> {
    const { saveTextFile } = await import("$lib/files");
    const content = cm.model.getValue();
    await saveTextFile(content, cm.entry.relativePath);
    saved?.(cm.model, cm.entry);
  }
</script>

<div {...props} bind:this={editorContainer}></div>
