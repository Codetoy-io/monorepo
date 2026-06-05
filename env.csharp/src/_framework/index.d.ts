export * from "./WasmSharpWorker";
import type { MonoConfig } from "./dotnet.js";
import type { Span } from "./Roslyn/Text.js";
import type { CompilationInterop } from "./CompilationInterop.js";
import { WellKnownTagArray } from "./Roslyn/WellKnownTags.js";
export interface WasmSharpModuleOptions {
    /**
     * URL to resolve assemblies from.
     * @default import.meta.url
     */
    assembliesUrl?: string;
    /**
     * @default false
     */
    enableDiagnosticTracing?: boolean;
    /**
     * https://github.com/dotnet/runtime/blob/a270140281a13ab82a4401dff3da6d27fe499087/src/mono/wasi/runtime/driver.c#L470
     * * debug_level > 0 enables debugging and sets the debug log level to debug_level
     * * debug_level == 0 disables debugging and enables interpreter optimizations
     * * debug_level < 0 enabled debugging and disables debug logging.
     *
     * Note: when debugging is enabled interpreter optimizations are disabled.
     *
     * @default 0
     */
    debugLevel?: number;
}
export interface WasmSharpModuleCallbacks {
    onConfigLoaded?(config: MonoConfig): void;
    onDownloadResourceProgress?(loadedResources: number, totalResources: number): void;
}
export type WasmSharpOptions = WasmSharpModuleOptions & WasmSharpModuleCallbacks;
export type CompletionItem = {
    displayText: string;
    filterText: string;
    sortText: string;
    inlineDescription: string;
    tags: WellKnownTagArray;
    span: Span;
};
export interface AssemblyExports {
    Input: {
        Reset: () => void;
        CallKeyUp: (key: string) => void;
        CallKeyDown: (key: string) => void;
        CallMouseUp: (button: number) => void;
        CallMouseDown: (button: number) => void;
        CallMouseMove: (x: number, y: number) => void;
        CallTouchStart: (id: number, x: number, y: number) => void;
        CallTouchEnd: (id: number) => void;
        CallTouchMove: (id: number, x: number, y: number) => void;
    };
    Screen: {
        Reset: () => void;
        CallUpdate: (deltaTime: number) => void;
        CallResize: (w: number, h: number) => void;
    };
    WasmSharp: {
        Core: {
            CompilationInterop: CompilationInterop;
        };
    };
}
export type DiagnosticSeverity = "Error" | "Warning" | "Info" | "Hidden";
export interface Diagnostic {
    id: string;
    message: string;
    location: Span;
    severity: DiagnosticSeverity;
}
interface RunResultSuccess {
    stdOut: string;
    stdErr: string;
    success: true;
    diagnostics: [];
}
interface RunResultFailure {
    stdOut: null;
    stdErr: null;
    success: false;
    diagnostics: Diagnostic[];
}
export type RunResult = RunResultSuccess | RunResultFailure;
export * from "./Roslyn/Text.js";
export * from "./Roslyn/WellKnownTags.js";
export * from "./WasmSharpWorker.js";
export { Compilation } from "./Compilation.js";
