/*********************
Example usage in an iframe 
*********************/

import { WasmSharpOptions, WasmSharpWorker } from "./index.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
let wasmSharp;

// /** @type {import("./dotnet").CreateDotnetRuntimeType} */
// const createDotnetRuntime = createDotnetRuntimeUntyped;
const wasmSharpOptions: WasmSharpOptions = {
  enableDiagnosticTracing: false,
  debugLevel: 1,
  onConfigLoaded(config: any) {
    console.log('WasmSharp config loaded', config);
  },
  onDownloadResourceProgress(loadedResources, totalResources) {
    // Send progress updates to parent
    window.parent.postMessage({
      env: 'csharp',
      type: 'progress',
      loaded: loadedResources,
      total: totalResources
    }, '*');
  }
};

try {
  wasmSharp = await WasmSharpWorker.initializeAsync(wasmSharpOptions, {
    context2D: {
      rect(x: number, y: number, w: number, h: number) {

      }
    },
    console: {
      log(msg: string) {

      }
    }
  });

} catch(err) {
  console.log("Error initializing WasmSharpWorker")
}

console.log("WasmSharp Exports", wasmSharp?.getExports())

console.log(
  "TODO: Hook into wasm runtime load and send bytes for arrays to create metadata references. Might not be feasible. (Maybe hook into mono_wasm_add_assembly?)"
);
// [DONE] console.log("TODO: Add loading progress hook - see ASP NET Core MonoPlatform.ts for examples.");
console.log("Test message that should be seen.");

// const style = `
// font-size:1.1rem;
// font-family:sans-serif;
// background-color:0x333;
// `;
// console.log("%cInitialising wasm compiler", style);
// const time = performance.now();
// console.log(`loading files from ${import.meta.url}`);
// await assemblyExports.CompilationInterop.InitAsync(
//   import.meta.url,
//   JSON.stringify(config)
// );
// const diff = performance.now() - time;
// console.log(`%cFinished initialising wasm compiler in ${diff}ms`, style);

//const context = await AssemblyContext.createAsync();
//const code = `
//using System;
//Console.WriteLine("Hello World");
//`;
//const compilation = context.createCompilation(code);

//compilation.recompile(code);
//const result = await compilation.run();
//console.log(result.success);
//console.log(result.stdOut);
//console.log(result.stdErr);

//document.getElementById("recompile")?.addEventListener("click", async () => {
//  compilation.recompile(code);
//  const result = await compilation.run();
//  console.log(result.success);
//  console.log(result.stdOut);
//  console.log(result.stdErr);
//});
