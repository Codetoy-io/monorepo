import type { AssemblyExports, WasmSharpOptions } from "./index.js";
import { CompilationInterop } from "./CompilationInterop.js";
import { Compilation } from "./Compilation.js";
export declare class WasmSharpWorker {
    private interop;
    private exports;
    constructor(interop: CompilationInterop, exports: AssemblyExports);
    static initializeAsync(options: WasmSharpOptions, imports: {}): Promise<WasmSharpWorker>;
    createCompilationAsync(code: string): Promise<Compilation>;
    getExports(): AssemblyExports;
}
