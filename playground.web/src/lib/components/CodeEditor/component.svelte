<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Monaco, Editor } from "./types";
  import { detectSystemTheme, watchSystemThemeChanges } from "$lib/theme";
  import { browser } from "$app/environment";
  import { getCompletionsProvider } from "./completionsProvider";
  import Env from "$lib/components/Env/component.svelte"
  
  let {
    monaco = $bindable() as typeof Monaco | undefined,
    editor = $bindable() as Editor.IStandaloneCodeEditor | undefined,
    mounted = undefined as
      | ((monaco: typeof Monaco, editor: Editor.IStandaloneCodeEditor) => Promise<void>)
      | undefined,
    updated,
    saveChanges,
    ...props
  }: {
    class?: string;
    editor?: Editor.IStandaloneCodeEditor;
    monaco?: typeof Monaco;
    updated?: (code:string) => {},
    saveChanges?: (code:string) => {},
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
        if (editor) {
          saveChanges?.(editor.getValue());
        }
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

    // Dispose all models so stale declaration/sketch models don't linger
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
    editor.onDidChangeModelContent(() => {
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
    monaco?.editor.getModels().forEach((model:any) => model.dispose());
    editor?.dispose();
  }
</script>

<div {...props} bind:this={editorContainer}></div>
