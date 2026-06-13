<script lang="ts">
  import { browser } from "$app/env";
  import { CodeEditor } from "$lib";
  import type { Monaco, Editor } from "$lib/components/CodeEditor/types";
  import Env from "$lib/components/Env/component.svelte";
  import { onMount } from "svelte";

  onMount(async () => {
    if (!browser) return;
    await codeEditor?.initialize(env, () => iframe);
  });

  let env: "csharp" | "as" | "lua" = $state("csharp");
  let iframe: Env | undefined;
  let codeEditor: undefined | CodeEditor;
  let monaco: typeof Monaco;
  let editor: Editor.IStandaloneCodeEditor;
  let currentCode: string = `
// Classic "hello world" program
// Docs: https://codetoy.io/docs/csharp
public static class Program {
    public static int Main(args[] string) {
        Console.Log("Hello world!");
    }
}`;

  async function mounted(
    _monaco: Monaco,
    _editorInstance: Editor.IStandaloneCodeEditor,
  ) {
    monaco = _monaco;
    editor = _editorInstance;

    if (env === "as") {
      // Create or reuse the named sketch.ts model
      const moduleUri = new monaco.Uri().with({ path: "sketch.ts" });
      let moduleModel = monaco.editor.getModel(moduleUri);
      if (!moduleModel) {
        moduleModel = monaco.editor.createModel(
          currentCode,
          "typescript",
          moduleUri,
        );
      } else {
        moduleModel.setValue(currentCode);
      }
    } else {
      // csharp / lua — anonymous model, just swap language and value
      const lang = env === "csharp" ? "csharp" : "lua";

      const existingModel = editor.getModel();
      if (existingModel) {
        monaco.editor.setModelLanguage(existingModel, lang);
        existingModel.setValue(currentCode);
      } else {
        const newModel = monaco.editor.createModel(currentCode, lang);
        editor.setModel(newModel);
      }
    }
  }

  function onReady() {}
  function writeLog(output:any, kind:any) { console.log("output:", output) }
  function onDiagnostics(diagnostics:any[]) { console.log("diag:", diagnostics) }
</script>

<div class="w-screen h-screen flex">
  <Env bind:this={iframe} {env} {onReady} {writeLog} {onDiagnostics}></Env>
  <CodeEditor
    bind:this={codeEditor}
    class="h-full w-full bg-base-200"
    {mounted}
  ></CodeEditor>
</div>
