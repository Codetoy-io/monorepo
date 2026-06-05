import { initializeWasmSharpModule } from "./initializeWasmSharpModule.js";
import type { AssemblyExports, WasmSharpOptions } from "./index.js";
import { CompilationInterop } from "./CompilationInterop.js";
import { Compilation } from "./Compilation.js";

export class WasmSharpWorker {
  constructor(private interop: CompilationInterop, private exports: AssemblyExports) {}
  static async initializeAsync(options: WasmSharpOptions, imports: {}) {
    const { compilationInterop, assemblyExports } = await initializeWasmSharpModule(options, imports);
    return new WasmSharpWorker(compilationInterop, assemblyExports);
  }
  createCompilationAsync(code: string) {
    return Promise.resolve(Compilation.create(code, this.interop));
  }
  getExports(): AssemblyExports {
    return this.exports;
  }
}

