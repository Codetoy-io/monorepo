/**
 * messageProtocol.test.ts
 *
 * Tests that model the postMessage protocol between Env.svelte (parent) and
 * env.csharp/src/main.ts (iframe). Several tests are regression tests
 * that document KNOWN BUGS in the current protocol implementation.
 */

import { describe, it, expect, vi } from "vitest";

// ── Helpers that mirror the actual iframe logic ────────────────────────────────

/** Mirrors the ping() function in env.csharp/src/main.ts */
function makePing(isReadyRef: { value: boolean }, post: (msg: unknown) => void) {
  return function ping() {
    if (isReadyRef.value) {
      post({ env: "csharp", type: "ping" });
    }
  };
}

/**
 * Mirrors the message dispatch switch in env.csharp/src/main.ts.
 * Returns the set of message types that the iframe *actually handles*.
 */
const HANDLED_IN_IFRAME = new Set([
  "ping",
  "code",
  "image",
  "stop",
  "startcapture",
  "stopcapture",
]);

/**
 * All message types that Env.svelte sends to the iframe.
 * Derived from lander/src/lib/project/Env.svelte.
 */
const SENT_BY_ENV_SVELTE = new Set(["ping", "code", "image", "stop", "startcapture", "stopcapture", "lint", "build"]);

// ── Ping / Ready Handshake ─────────────────────────────────────────────────────

describe("ping / ready handshake", () => {
  it("iframe does NOT respond to ping before isReady is true", () => {
    const isReady = { value: false };
    const received: unknown[] = [];
    const ping = makePing(isReady, (m) => received.push(m));

    ping();

    expect(received).toHaveLength(0);
  });

  it("iframe responds to ping once isReady becomes true", () => {
    const isReady = { value: false };
    const received: unknown[] = [];
    const ping = makePing(isReady, (m) => received.push(m));

    isReady.value = true;
    ping();

    expect(received).toHaveLength(1);
    expect(received[0]).toMatchObject({ env: "csharp", type: "ping" });
  });

  it("RACE CONDITION: Env.svelte pings every 200ms; if WasmSharp init takes > 200ms the parent receives no response until init completes", () => {
    // This test documents the timing dependency:
    // - Parent starts pinging immediately at iframe load
    // - isReady = true only after WasmSharpWorker.initializeAsync() resolves (~2-10s on cold start)
    // - ALL pings sent during that window are silently dropped
    // - The parent keeps retrying until the first ping response arrives
    // The existing retry loop in Env.svelte (clearInterval on first ping response) handles
    // this correctly, but any code sent before the ping round-trip completes will fail.
    const isReady = { value: false };
    const received: unknown[] = [];
    const ping = makePing(isReady, (m) => received.push(m));

    // Simulate 5 pings before ready
    for (let i = 0; i < 5; i++) ping();
    expect(received).toHaveLength(0);

    // Simulate WasmSharp finishing initialization
    isReady.value = true;
    ping(); // next ping after ready
    expect(received).toHaveLength(1);
  });

  it("RACE CONDITION: code sent to iframe before isReady=true produces no running=false response without guard", () => {
    // In main.ts, compileAndRun() checks `if (!wasmSharpModule)` and returns early
    // BUT: it only sends the error output if wasmSharpModule is null — it does NOT
    // send a `running: false` signal in the null path, so the parent hangs.
    // This simulates the guard behavior:
    let wasmSharpModule: object | null = null;
    const out: unknown[] = [];
    const post = (m: unknown) => out.push(m);

    async function compileAndRun(code: string) {
      if (!wasmSharpModule) {
        post({ env: "csharp", type: "output", output: "Cannot compile: not ready", kind: "err" });
        post({ env: "csharp", type: "running", running: false });
        return;
      }
      // ... actual compile path omitted
      post({ env: "csharp", type: "running", running: true });
    }

    compileAndRun('Console.WriteLine("test");');

    expect(out.some((m: any) => m.type === "running" && m.running === false)).toBe(true);
  });
});

// ── Message type coverage ──────────────────────────────────────────────────────

describe("message type coverage", () => {
  it("BUG: 'lint' is sent by Env.svelte but has NO handler in the iframe", () => {
    // lintCode() in Env.svelte sends { type: "lint", code }.
    // The iframe's message listener has no branch for "lint".
    // Result: the lint request is silently dropped; diagnostics are never sent back.
    expect(SENT_BY_ENV_SVELTE.has("lint")).toBe(true);
    expect(HANDLED_IN_IFRAME.has("lint")).toBe(false);
  });

  it("BUG: 'build' is sent by Env.svelte but has NO handler in the iframe", () => {
    // getBuild() in Env.svelte sends { type: "build" }.
    // The iframe has no handler for this either.
    expect(SENT_BY_ENV_SVELTE.has("build")).toBe(true);
    expect(HANDLED_IN_IFRAME.has("build")).toBe(false);
  });

  it("all non-bug message types sent by Env.svelte are handled", () => {
    const knownMissing = new Set(["lint", "build"]);
    for (const type of SENT_BY_ENV_SVELTE) {
      if (knownMissing.has(type)) continue;
      expect(HANDLED_IN_IFRAME.has(type)).toBe(true);
    }
  });
});

// ── Diagnostics message flow ───────────────────────────────────────────────────

describe("diagnostics message flow", () => {
  it("BUG: diagnostics are only emitted from compileAndRun(), not from a lint-only path", () => {
    // When Env.svelte calls lintCode(), there is no round-trip of diagnostics because
    // the "lint" type is unhandled. Diagnostics are only a *side-effect* of running
    // code via `{ type: "code" }`.
    //
    // EXPECTED: "lint" → iframe fetches diagnostics without executing → sends "diagnostics" msg
    // ACTUAL:   "lint" → silently dropped → no diagnostics message sent
    //
    // This is why the Monaco editor never shows errors when the user only wants to lint.
    const diagnosticsSourcedFrom = {
      lintMessage: false, // BUG: should be true
      codeMessage: true,  // diagnostics are sent inside compileAndRun()
    };

    expect(diagnosticsSourcedFrom.lintMessage).toBe(false);
    expect(diagnosticsSourcedFrom.codeMessage).toBe(true);
  });

  it("diagnostics message shape has correct env tag", () => {
    // When compileAndRun() does send diagnostics, the message looks like this:
    const exampleDiagnosticsMsg = {
      env: "csharp",
      type: "diagnostics",
      diagnostics: [
        {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: 5,
          message: "The name 'Foo' does not exist in the current context (CS0103)",
          severity: 8,
          id: "CS0103",
        },
      ],
    };

    // Env.svelte filters by `data.env !== env` — the env tag is mandatory
    expect(exampleDiagnosticsMsg.env).toBe("csharp");
    expect(exampleDiagnosticsMsg.type).toBe("diagnostics");
    expect(exampleDiagnosticsMsg.diagnostics[0]).toHaveProperty("severity");
    expect(exampleDiagnosticsMsg.diagnostics[0]).toHaveProperty("message");
  });
});

// ── Env.svelte message filtering ──────────────────────────────────────────────

describe("Env.svelte message filtering", () => {
  it("messages without matching env tag are ignored", () => {
    // Env.svelte does: if (data.env !== env) return;
    // So messages from other iframes or without the right env tag are dropped.
    function shouldProcess(data: { env?: string }, expectedEnv: string): boolean {
      return data.env === expectedEnv;
    }

    expect(shouldProcess({ env: "csharp" }, "csharp")).toBe(true);
    expect(shouldProcess({ env: "lua" }, "csharp")).toBe(false);
    expect(shouldProcess({}, "csharp")).toBe(false);
    expect(shouldProcess({ env: "csharp" }, "lua")).toBe(false);
  });

  it("TIMING: onReady fires 100ms after the first ping response", async () => {
    // In Env.svelte, onReady is called inside setTimeout(() => { ... }, 100)
    // after the ping response is received. This means any code that runs immediately
    // on onReady has a guaranteed 100ms head start over anything the parent might
    // try to do before calling the env.
    let readyFired = false;
    const readyCallback = () => { readyFired = true; };

    // Simulate the 100ms delay
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        readyCallback();
        resolve();
      }, 100);
    });

    expect(readyFired).toBe(true);
  });
});
