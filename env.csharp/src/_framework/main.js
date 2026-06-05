/*********************
Example usage in an iframe
*********************/
import { WasmSharpWorker } from "./index.js";
const canvas = document.getElementById("canvas");
let wasmSharp;
// /** @type {import("./dotnet").CreateDotnetRuntimeType} */
// const createDotnetRuntime = createDotnetRuntimeUntyped;
const wasmSharpOptions = {
    enableDiagnosticTracing: false,
    debugLevel: 1,
    onConfigLoaded(config) {
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
            rect(x, y, w, h) {
            }
        },
        console: {
            log(msg) {
            }
        }
    });
}
catch (err) {
    console.log("Error initializing WasmSharpWorker");
}
console.log("WasmSharp Exports", wasmSharp?.getExports());
console.log("TODO: Hook into wasm runtime load and send bytes for arrays to create metadata references. Might not be feasible. (Maybe hook into mono_wasm_add_assembly?)");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztzQkFFc0I7QUFFdEIsT0FBTyxFQUFvQixlQUFlLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFL0QsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQXNCLENBQUM7QUFDdEUsSUFBSSxTQUFTLENBQUM7QUFFZCw0REFBNEQ7QUFDNUQsMERBQTBEO0FBQzFELE1BQU0sZ0JBQWdCLEdBQXFCO0lBQ3pDLHVCQUF1QixFQUFFLEtBQUs7SUFDOUIsVUFBVSxFQUFFLENBQUM7SUFDYixjQUFjLENBQUMsTUFBVztRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFDRCwwQkFBMEIsQ0FBQyxlQUFlLEVBQUUsY0FBYztRQUN4RCxrQ0FBa0M7UUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDeEIsR0FBRyxFQUFFLFFBQVE7WUFDYixJQUFJLEVBQUUsVUFBVTtZQUNoQixNQUFNLEVBQUUsZUFBZTtZQUN2QixLQUFLLEVBQUUsY0FBYztTQUN0QixFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsQ0FBQztDQUNGLENBQUM7QUFFRixJQUFJLENBQUM7SUFDSCxTQUFTLEdBQUcsTUFBTSxlQUFlLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFO1FBQ2xFLFNBQVMsRUFBRTtZQUNULElBQUksQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO1lBRS9DLENBQUM7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLEdBQUcsQ0FBQyxHQUFXO1lBRWYsQ0FBQztTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBRUwsQ0FBQztBQUFDLE9BQU0sR0FBRyxFQUFFLENBQUM7SUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUE7QUFDbkQsQ0FBQztBQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFFekQsT0FBTyxDQUFDLEdBQUcsQ0FDVCw2SkFBNkosQ0FDOUosQ0FBQztBQUNGLDBHQUEwRztBQUMxRyxPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFFakQsa0JBQWtCO0FBQ2xCLG9CQUFvQjtBQUNwQiwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCLEtBQUs7QUFDTCxzREFBc0Q7QUFDdEQsa0NBQWtDO0FBQ2xDLHdEQUF3RDtBQUN4RCxzREFBc0Q7QUFDdEQscUJBQXFCO0FBQ3JCLDJCQUEyQjtBQUMzQixLQUFLO0FBQ0wseUNBQXlDO0FBQ3pDLDRFQUE0RTtBQUU1RSxzREFBc0Q7QUFDdEQsZ0JBQWdCO0FBQ2hCLGVBQWU7QUFDZixtQ0FBbUM7QUFDbkMsSUFBSTtBQUNKLHNEQUFzRDtBQUV0RCw4QkFBOEI7QUFDOUIseUNBQXlDO0FBQ3pDLDhCQUE4QjtBQUM5Qiw2QkFBNkI7QUFDN0IsNkJBQTZCO0FBRTdCLCtFQUErRTtBQUMvRSxnQ0FBZ0M7QUFDaEMsMkNBQTJDO0FBQzNDLGdDQUFnQztBQUNoQywrQkFBK0I7QUFDL0IsK0JBQStCO0FBQy9CLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqXG5FeGFtcGxlIHVzYWdlIGluIGFuIGlmcmFtZSBcbioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgV2FzbVNoYXJwT3B0aW9ucywgV2FzbVNoYXJwV29ya2VyIH0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG5sZXQgd2FzbVNoYXJwO1xuXG4vLyAvKiogQHR5cGUge2ltcG9ydChcIi4vZG90bmV0XCIpLkNyZWF0ZURvdG5ldFJ1bnRpbWVUeXBlfSAqL1xuLy8gY29uc3QgY3JlYXRlRG90bmV0UnVudGltZSA9IGNyZWF0ZURvdG5ldFJ1bnRpbWVVbnR5cGVkO1xuY29uc3Qgd2FzbVNoYXJwT3B0aW9uczogV2FzbVNoYXJwT3B0aW9ucyA9IHtcbiAgZW5hYmxlRGlhZ25vc3RpY1RyYWNpbmc6IGZhbHNlLFxuICBkZWJ1Z0xldmVsOiAxLFxuICBvbkNvbmZpZ0xvYWRlZChjb25maWc6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKCdXYXNtU2hhcnAgY29uZmlnIGxvYWRlZCcsIGNvbmZpZyk7XG4gIH0sXG4gIG9uRG93bmxvYWRSZXNvdXJjZVByb2dyZXNzKGxvYWRlZFJlc291cmNlcywgdG90YWxSZXNvdXJjZXMpIHtcbiAgICAvLyBTZW5kIHByb2dyZXNzIHVwZGF0ZXMgdG8gcGFyZW50XG4gICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7XG4gICAgICBlbnY6ICdjc2hhcnAnLFxuICAgICAgdHlwZTogJ3Byb2dyZXNzJyxcbiAgICAgIGxvYWRlZDogbG9hZGVkUmVzb3VyY2VzLFxuICAgICAgdG90YWw6IHRvdGFsUmVzb3VyY2VzXG4gICAgfSwgJyonKTtcbiAgfVxufTtcblxudHJ5IHtcbiAgd2FzbVNoYXJwID0gYXdhaXQgV2FzbVNoYXJwV29ya2VyLmluaXRpYWxpemVBc3luYyh3YXNtU2hhcnBPcHRpb25zLCB7XG4gICAgY29udGV4dDJEOiB7XG4gICAgICByZWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xuXG4gICAgICB9XG4gICAgfSxcbiAgICBjb25zb2xlOiB7XG4gICAgICBsb2cobXNnOiBzdHJpbmcpIHtcblxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbn0gY2F0Y2goZXJyKSB7XG4gIGNvbnNvbGUubG9nKFwiRXJyb3IgaW5pdGlhbGl6aW5nIFdhc21TaGFycFdvcmtlclwiKVxufVxuXG5jb25zb2xlLmxvZyhcIldhc21TaGFycCBFeHBvcnRzXCIsIHdhc21TaGFycD8uZ2V0RXhwb3J0cygpKVxuXG5jb25zb2xlLmxvZyhcbiAgXCJUT0RPOiBIb29rIGludG8gd2FzbSBydW50aW1lIGxvYWQgYW5kIHNlbmQgYnl0ZXMgZm9yIGFycmF5cyB0byBjcmVhdGUgbWV0YWRhdGEgcmVmZXJlbmNlcy4gTWlnaHQgbm90IGJlIGZlYXNpYmxlLiAoTWF5YmUgaG9vayBpbnRvIG1vbm9fd2FzbV9hZGRfYXNzZW1ibHk/KVwiXG4pO1xuLy8gW0RPTkVdIGNvbnNvbGUubG9nKFwiVE9ETzogQWRkIGxvYWRpbmcgcHJvZ3Jlc3MgaG9vayAtIHNlZSBBU1AgTkVUIENvcmUgTW9ub1BsYXRmb3JtLnRzIGZvciBleGFtcGxlcy5cIik7XG5jb25zb2xlLmxvZyhcIlRlc3QgbWVzc2FnZSB0aGF0IHNob3VsZCBiZSBzZWVuLlwiKTtcblxuLy8gY29uc3Qgc3R5bGUgPSBgXG4vLyBmb250LXNpemU6MS4xcmVtO1xuLy8gZm9udC1mYW1pbHk6c2Fucy1zZXJpZjtcbi8vIGJhY2tncm91bmQtY29sb3I6MHgzMzM7XG4vLyBgO1xuLy8gY29uc29sZS5sb2coXCIlY0luaXRpYWxpc2luZyB3YXNtIGNvbXBpbGVyXCIsIHN0eWxlKTtcbi8vIGNvbnN0IHRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbi8vIGNvbnNvbGUubG9nKGBsb2FkaW5nIGZpbGVzIGZyb20gJHtpbXBvcnQubWV0YS51cmx9YCk7XG4vLyBhd2FpdCBhc3NlbWJseUV4cG9ydHMuQ29tcGlsYXRpb25JbnRlcm9wLkluaXRBc3luYyhcbi8vICAgaW1wb3J0Lm1ldGEudXJsLFxuLy8gICBKU09OLnN0cmluZ2lmeShjb25maWcpXG4vLyApO1xuLy8gY29uc3QgZGlmZiA9IHBlcmZvcm1hbmNlLm5vdygpIC0gdGltZTtcbi8vIGNvbnNvbGUubG9nKGAlY0ZpbmlzaGVkIGluaXRpYWxpc2luZyB3YXNtIGNvbXBpbGVyIGluICR7ZGlmZn1tc2AsIHN0eWxlKTtcblxuLy9jb25zdCBjb250ZXh0ID0gYXdhaXQgQXNzZW1ibHlDb250ZXh0LmNyZWF0ZUFzeW5jKCk7XG4vL2NvbnN0IGNvZGUgPSBgXG4vL3VzaW5nIFN5c3RlbTtcbi8vQ29uc29sZS5Xcml0ZUxpbmUoXCJIZWxsbyBXb3JsZFwiKTtcbi8vYDtcbi8vY29uc3QgY29tcGlsYXRpb24gPSBjb250ZXh0LmNyZWF0ZUNvbXBpbGF0aW9uKGNvZGUpO1xuXG4vL2NvbXBpbGF0aW9uLnJlY29tcGlsZShjb2RlKTtcbi8vY29uc3QgcmVzdWx0ID0gYXdhaXQgY29tcGlsYXRpb24ucnVuKCk7XG4vL2NvbnNvbGUubG9nKHJlc3VsdC5zdWNjZXNzKTtcbi8vY29uc29sZS5sb2cocmVzdWx0LnN0ZE91dCk7XG4vL2NvbnNvbGUubG9nKHJlc3VsdC5zdGRFcnIpO1xuXG4vL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb21waWxlXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xuLy8gIGNvbXBpbGF0aW9uLnJlY29tcGlsZShjb2RlKTtcbi8vICBjb25zdCByZXN1bHQgPSBhd2FpdCBjb21waWxhdGlvbi5ydW4oKTtcbi8vICBjb25zb2xlLmxvZyhyZXN1bHQuc3VjY2Vzcyk7XG4vLyAgY29uc29sZS5sb2cocmVzdWx0LnN0ZE91dCk7XG4vLyAgY29uc29sZS5sb2cocmVzdWx0LnN0ZEVycik7XG4vL30pO1xuIl19