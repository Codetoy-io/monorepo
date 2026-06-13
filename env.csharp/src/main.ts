// (env.csharp) main.ts
// A live coding environment for C# that runs in the browser using WebAssembly

import {
  Compilation,
  WasmSharpWorker,
  type AssemblyExports,
  type Diagnostic,
  type WasmSharpOptions,
} from "@wasmsharp/core";

import { CanvasRecorder, blobToBase64 } from "./minimal-recording-utils";

import { init, setExports, canvas, _resetCtx } from "@codetoy-io/bindings.web/runtime";
import * as canvasModule from "@codetoy-io/bindings.web/canvas";

// ─── Boot runtime ─────────────────────────────────────────────────────────────

init({
  container: document.getElementById("app")!,
  clearEachFrame: false, // C# playground code must reset its own canvas via Canvas.Reset()
  onError(err) {
    postOut(String(err), "err");
  },
});


// ─── Globals ──────────────────────────────────────────────────────────────────

let isReady = false;
let recorder: CanvasRecorder | null = null;
let wasmSharpModule: WasmSharpWorker | null = null;
let currentCompilation: Compilation | null = null;
let csExports: AssemblyExports | null = null;

// ─── WasmSharp imports ────────────────────────────────────────────────────────
// canvasModule implements the identical shape that WasmSharp expects under
// "context2D", so we can pass it through directly.

const imports = {
  context2D: canvasModule,
  console: {
    log(msg: string)   { postOut(msg, "log"); },
    warn(msg: string)  { postOut(msg, "wrn"); },
    error(msg: string) { postOut(msg, "err"); },
  },
};

// ─── Bridge: bindings.web runtime ↔ WasmSharp export shape ───────────────
// The runtime calls setExports() expecting flat WASM-style callbacks.
// WasmSharp exposes a structured API (exports.Screen.CallUpdate etc.),
// so we adapt it here once, after WasmSharp is ready and after each recompile.

function bridgeExports(e: AssemblyExports) {
  setExports({
    update()                    { e.Screen?.CallUpdate?.(cachedDelta()); },
    resize(w: number, h: number){ e.Screen?.CallResize?.(w, h); },
    onMouseDown(btn: number)    { e.Input?.CallMouseDown?.(btn); },
    onMouseUp(btn: number)      { e.Input?.CallMouseUp?.(btn); },
    onKeyDown(key: string)      { e.Input?.CallKeyDown?.(key); },
    onKeyUp(key: string)        { e.Input?.CallKeyUp?.(key); },
    // mousemove is handled separately — WasmSharp takes (x, y) not a DOM event
    onTouchStart(id, x, y)          { e.Input?.CallTouchStart?.(id, x, y); },
    onTouchEnd(id)                   { e.Input?.CallTouchEnd?.(id); },
    onTouchMove(id, x, y)           { e.Input?.CallTouchMove?.(id, x, y); },
  });
}

// deltaTime is managed by the runtime loop internally; we need the value here
// to forward into C# each frame. Import the cached value from the time module.
import { deltaTime as cachedDelta } from "@codetoy-io/bindings.web/time";

// mousemove isn't part of WasmExports in the runtime (it's positional state,
// not an event callback), so we wire it manually on the shared canvas.
canvas.addEventListener("mousemove", (e) => {
  const r = canvas.getBoundingClientRect();
  csExports?.Input?.CallMouseMove?.(e.clientX - r.left, e.clientY - r.top);
});

// ─── Messaging ────────────────────────────────────────────────────────────────

function postOut(output: string, kind: "log" | "wrn" | "err") {
  window.parent.postMessage({ env: "csharp", type: "output", output, kind }, "*");
}

function ping() {
  if (isReady) {
    window.parent.postMessage({ env: "csharp", type: "ping" }, "*");
    postOut("IFRAME: Ping received. C# environment is alive.", "log");
  }
}

window.addEventListener("message", async (event) => {
  const { type, code } = event.data;

  if      (type === "ping")         { ping(); }
  else if (type === "code")         { await compileAndRun(code); }
  else if (type === "lint")         { await lintOnly(code); }
  else if (type === "completions")  { await sendCompletions(event.data.caretOffset, event.data.requestId, event.data.code); }
  else if (type === "image")        { await sendImageToParent(); }
  else if (type === "stop")         { await stop(); }
  else if (type === "startcapture") { await startCapture(event.data.fps, event.data.includeAudio); }
  else if (type === "stopcapture")  { await stopCapture(); }
});

// ─── Initialize WasmSharp ─────────────────────────────────────────────────────

async function initializeWasmSharp() {
  const opts: WasmSharpOptions = {
    enableDiagnosticTracing: false,
    debugLevel: 1,
    onConfigLoaded(config: any) {
      console.log("WasmSharp config loaded", config);
    },
    onDownloadResourceProgress(loaded, total) {
      window.parent.postMessage({ env: "csharp", type: "progress", loaded, total }, "*");
    },
  };

  try {
    wasmSharpModule = await WasmSharpWorker.initializeAsync(opts, imports);
    isReady = true;
  } catch (error) {
    console.error("Failed to initialize WasmSharp:", error);
    postOut("IFRAME: Failed to initialize WasmSharp: " + String(error), "err");
    return;
  }

  csExports = wasmSharpModule!.getExports();

  // Trigger initial resize through the runtime (runtime fires resize → bridge → C#)
  // but also call directly since the loop may not have ticked yet
  csExports.Screen?.CallResize?.(window.innerWidth, window.innerHeight);
  bridgeExports(csExports);
}

// ─── Compile and run ──────────────────────────────────────────────────────────

async function compileAndRun(code: string) {
  postOut("IFRAME: Compiling code...", "log");
  csExports?.Input?.Reset?.();
  csExports?.Screen?.Reset?.();
  csExports?.Screen?.CallResize?.(window.innerWidth, window.innerHeight);

  if (!wasmSharpModule) {
    postOut("IFRAME: Cannot compile code, WasmSharp failed to initialize.", "err");
    window.parent.postMessage({ env: "csharp", type: "running", running: false }, "*");
    return;
  }

  try {
    if (!currentCompilation) {
      currentCompilation = await wasmSharpModule.createCompilationAsync(code);
    } else {
      await currentCompilation.recompileAsync(code);
    }

    const diagnostics: Diagnostic[] = await currentCompilation.getDiagnosticsAsync();
    const monacoMarkers = diagnostics.map(d => {
      const start = getRowCol(d.location?.start ?? 0, code);
      const end   = getRowCol(d.location?.end   ?? 0, code);
      return {
        startLineNumber: start.row, startColumn: start.col,
        endLineNumber:   end.row,   endColumn:   end.col,
        message:  d.message + " (" + d.id + ")",
        severity: mapSeverity(d.severity),
        id: d.id,
      };
    });

    window.parent.postMessage({ env: "csharp", type: "diagnostics", diagnostics: monacoMarkers }, "*");

    // for each diagnostic send detailed information to console with postOut
    const errors = diagnostics.filter(x => x.severity === "Error");
    if (errors.length > 0) {
      let errorReport = `IFRAME: Compilation failed with ${errors.length} error(s):\n`;
      diagnostics.forEach((d, index) => {
        // const severity = d.severity === "Error" ? "err" : d.severity === "Warning" ? "wrn" : "log";
        const location = d.location ? ` at line ${getRowCol(d.location.start ?? 0, code).row}` : "";
        errorReport += `\n${d.id}: ${d.message}${location}`;
      });
      errorReport += `\n\nPlease review the code and try again.`;
      postOut(errorReport, "err");
      window.parent.postMessage({ env: "csharp", type: "running", running: false }, "*");
      return;
    }

    const result = await currentCompilation.run();

    if (!result.success) {
      window.parent.postMessage({
        type: "runtime-error",
        message: "Program failed to run",
        diagnostics: result.diagnostics.map((d: Diagnostic) => ({
          severity: d.severity, message: d.message, id: d.id, location: d.location,
        })),
      }, "*");
    } else if (result.stdOut) {
      postOut("IFRAME: " + result.stdOut, "log");
    }

    // Re-bridge in case recompile changed the exports object
    csExports = wasmSharpModule.getExports();
    bridgeExports(csExports);

  } catch (error) {
    postOut("IFRAME: Unexpected error: " + String(error), "err");
    window.parent.postMessage({ env: "csharp", type: "running", running: false }, "*");
    return;
  }
  window.parent.postMessage({ env: "csharp", type: "running", running: true }, "*");
}

async function stop() {
  setExports({}); // swap to empty exports, effectively stopping the program
  _resetCtx(); // clear the canvas immediately
  window.parent.postMessage({ env: "csharp", type: "running", running: false }, "*");
}

async function sendCompletions(caretOffset: number, requestId: number, code: string) {
  if (!wasmSharpModule) return;
  try {
    if (!currentCompilation) {
      currentCompilation = await wasmSharpModule.createCompilationAsync(code);
    } else {
      await currentCompilation.recompileAsync(code);
    }
    const completions = (await currentCompilation.getCompletions(caretOffset)) ?? [];
    window.parent.postMessage({ env: "csharp", type: "completions", requestId, completions }, "*");
  }
  catch(e) {
    postOut(String(e), "err");
    window.parent.postMessage({ env: "csharp", type: "completions", requestId, completions: [] }, "*");
  }
}

async function lintOnly(code: string) {
  if (!wasmSharpModule) return;
  try {
    if (!currentCompilation) {
      currentCompilation = await wasmSharpModule.createCompilationAsync(code);
    } else {
      await currentCompilation.recompileAsync(code);
    }
    const diagnostics: Diagnostic[] = await currentCompilation.getDiagnosticsAsync();
    const monacoMarkers = diagnostics.map(d => {
      const start = getRowCol(d.location?.start ?? 0, code);
      const end   = getRowCol(d.location?.end   ?? 0, code);
      return {
        startLineNumber: start.row, startColumn: start.col,
        endLineNumber:   end.row,   endColumn:   end.col,
        message:  d.message + " (" + d.id + ")",
        severity: mapSeverity(d.severity),
        id: d.id,
      };
    });
    window.parent.postMessage({ env: "csharp", type: "diagnostics", diagnostics: monacoMarkers }, "*");
  } catch (error) {
    console.error("Lint error:", error);
  }
}

// ─── Capture ──────────────────────────────────────────────────────────────────

async function startCapture(fps = 30, includeAudio = true) {
  if (!canvas) return;
  recorder = new CanvasRecorder(canvas);
  await recorder.start(fps, includeAudio);
  window.parent.postMessage({ env: "csharp", type: "capturestarted" }, "*");
}

async function stopCapture() {
  if (!recorder) return;
  const blob  = await recorder.stop();
  const base64 = await blobToBase64(blob);
  window.parent.postMessage({ env: "csharp", type: "getcapture", video: base64 }, "*");
  recorder = null;
}

async function sendImageToParent() {
  if (!canvas) { postOut("IFRAME: Failed to send thumbnail, canvas is missing.", "err"); return; }
  window.parent.postMessage({ env: "csharp", type: "image", image: canvas.toDataURL("image/png") }, "*");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRowCol(pos: number, text: string): { row: number; col: number } {
  let row = 1, col = 1;
  for (let i = 0; i < pos && i < text.length; i++) {
    if (text[i] === "\n") { row++; col = 1; } else { col++; }
  }
  return { row, col };
}

function mapSeverity(severity: string): number {
  if (severity === "Error")   return 8;
  if (severity === "Warning") return 4;
  if (severity === "Hidden")  return 1;
  return 2;
}

// ─── Start ────────────────────────────────────────────────────────────────────

await initializeWasmSharp();