// (env.as) main.ts - A live coding environment for AssemblyScript that runs in the browser using WebAssembly

/**
 * iframe.ts — playground host
 *
 * Responsibilities:
 *   1. Boot the codetoy runtime
 *   2. Compile incoming AssemblyScript code to WASM
 *   3. Swap exports into the runtime after each compile
 *   4. Handle messaging with the parent frame
 */

// ─── Imports ─────────────────────────────────────────────────────────────────

// Runtime and bindings
import canvasSrc from "@codetoy-io/bindings.web/assembly/canvas.ts?raw";
import timeSrc   from "@codetoy-io/bindings.web/assembly/time.ts?raw";
import screenSrc from "@codetoy-io/bindings.web/assembly/screen.ts?raw";
import inputSrc  from "@codetoy-io/bindings.web/assembly/input.ts?raw";
import { init, setExports, wasmImports, canvas, _resetCtx } from "@codetoy-io/bindings.web/runtime";

// AS compiler
import asc from "assemblyscript/asc";

// Canvas recording
import { CanvasRecorder, blobToBase64 } from "./minimal-recording-utils";

// ─── Boot ─────────────────────────────────────────────────────────────────────

let isReady = false;
const appContainer = document.getElementById("app")!;

init({
  container: appContainer,
  clearEachFrame: false, // user code manages its own resets
  onError(err) {
    postOut(String(err), "err");
  },
});

// Redirect console to parent
console.log   = (msg: string) => postOut(msg, "log");
console.warn  = (msg: string) => postOut(msg, "wrn");
console.error = (msg: string) => postOut(msg, "err");

function postOut(output: string, kind: "log" | "wrn" | "err") {
  window.parent.postMessage({ env: "as", type: "output", output, kind }, "*");
}

// ─── Recording ────────────────────────────────────────────────────────────────

let recorder: CanvasRecorder | null = null;

// ─── Build cache ──────────────────────────────────────────────────────────────

let lastBytes:          Uint8Array | string | null = null;
let lastInstantiate:    string | null = null;

// ─── Message handling ─────────────────────────────────────────────────────────

window.addEventListener("message", async ({ data }) => {
  switch (data.type) {
    case "ping":         return ping();
    case "code":         return run(data.code);
    case "stop":         return stop();
    case "image":        return sendImageToParent();
    case "build":        return sendBuildToParent();
    case "startcapture": return startCapture(data.fps, data.includeAudio);
    case "stopcapture":  return stopCapture();
  }
});

function ping() {
  if (isReady) {
    window.parent.postMessage({ env: "as", type: "ping" }, "*");
    postOut("IFRAME: Ping received. AS environment is alive.", "log");
  }
}

// ─── Compile + run ────────────────────────────────────────────────────────────

async function run(code: string) {
  postOut("IFRAME: Compiling code...", "log");
  
  _resetCtx(); // clear the canvas immediately

  try {
    const result = await compileToWasm(code);
    if (!result) return;

    const { bytes, instantiate, "instantiate.js": functionString } = result;
    lastBytes       = bytes;
    lastInstantiate = functionString;

    const compiled = await WebAssembly.compile(bytes as BufferSource);
    const exports  = await instantiate(compiled as BufferSource, wasmImports);

    setExports(null)

    setExports(exports); // swap — loop keeps running
  } catch (err) {
    postOut("IFRAME: Error during compilation or execution: " + String(err), "err");
    window.parent.postMessage({ env: "as", type: "running", running: false }, "*");
    return;
  }

  window.parent.postMessage({ env: "as", type: "running", running: true }, "*");
}

async function stop() {
  setExports(null); // swap to empty exports, effectively stopping the program
  _resetCtx(); // clear the canvas immediately
  window.parent.postMessage({ env: "as", type: "running", running: false }, "*");
}

// ─── Messaging helpers ────────────────────────────────────────────────────────

async function sendImageToParent() {
  if (!canvas) {
    postOut("IFRAME: Failed to send thumbnail, canvas is missing.", "err");
    return;
  }
  window.parent.postMessage({
    env: "as", type: "image",
    image: canvas.toDataURL("image/png"),
  }, "*");
}

async function sendBuildToParent() {
  if (!lastBytes || !lastInstantiate) {
    postOut("Failed to send build — no builds in cache.", "err");
    return;
  }
  window.parent.postMessage({
    env: "as", 
    type: "build",
    build: {
      "build.wasm": lastBytes,
      "instantiate.js": lastInstantiate,
    }
  }, "*");
}

async function startCapture(fps = 30, includeAudio = true) {
  if (!canvas) return;
  recorder = new CanvasRecorder(canvas);
  await recorder.start(fps, includeAudio);
  window.parent.postMessage({ env: "as", type: "capturestarted" }, "*");
}

async function stopCapture() {
  if (!recorder) return;
  const blob   = await recorder.stop();
  const base64 = await blobToBase64(blob);
  window.parent.postMessage({ env: "as", type: "getcapture", video: base64 }, "*");
  recorder = null;
}

// ─── AssemblyScript compiler ──────────────────────────────────────────────────

type InstantiateFunction = (
  module:  BufferSource,
  imports: WebAssembly.Imports,
) => Promise<WebAssembly.Exports>;

async function compileToWasm(
  code: string,
): Promise<{ bytes: Uint8Array; instantiate: InstantiateFunction, 'instantiate.js': string } | null> {
  const stderr: string[] = [];
  const outputs: Record<string, string | Uint8Array> = {};

  const files: Record<string, string> = {
    "node_modules/codetoy/canvas.ts": canvasSrc,
    "node_modules/codetoy/time.ts":   timeSrc,
    "node_modules/codetoy/screen.ts": screenSrc,
    "node_modules/codetoy/input.ts":  inputSrc,
    "sketch.ts": code,
  };

  try {
    await asc.main([
      "sketch.ts",
      "--runtime",    "incremental",
      "--textFile",   "module.wat",
      "--outFile",    "module.wasm",
      "--bindings",   "raw",
      "--sourceMap",
      "--exportStart",
    ], {
      stdout: { write() {} },
      stderr: { write(chunk) { stderr.push(chunk.toString()); } },
      readFile:  (name)       => files[name] ?? null,
      writeFile: (name, data) => { outputs[name] = data; },
      listFiles: ()           => [],
    });
  } catch (e) {
    postOut(`Compilation exception: ${e}`, "err");
    return null;
  }

  const errStr = stderr.join("");
  if (errStr) {
    postOut(errStr, "err");
    return null;
  }

  const bytes = outputs["module.wasm"] as Uint8Array;
  const rawjs = outputs["module.js"] as string;
  const functionString = `return { async ${(outputs["module.js"] as string).slice(22)} }`
  const instantiate = (new Function(functionString))().instantiate as InstantiateFunction;

  return { bytes, instantiate, "instantiate.js": rawjs };
}

isReady = true;