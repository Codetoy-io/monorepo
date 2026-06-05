import { CompilationInterop } from "./CompilationInterop.js";
import type { AssemblyExports, WasmSharpOptions } from "./index.js";
export declare function initializeWasmSharpModule(options: WasmSharpOptions, imports: {}): Promise<{
    compilationInterop: CompilationInterop;
    assemblyExports: AssemblyExports;
}>;
