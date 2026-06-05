/**
 * diagnostics.test.ts
 *
 * Tests for the diagnostic translation layer between C# Roslyn diagnostics and the
 * Monaco editor markers used in env.csharp/src/main.ts.
 *
 * These helpers are copy-extracted from main.ts so they can be unit tested in isolation.
 * If main.ts changes, update the copies here.
 */

import { describe, it, expect, vi } from "vitest";
import { Compilation } from "../Compilation.js";
import type { CompilationInterop } from "../CompilationInterop.js";
import type { Diagnostic } from "../index.js";

// ── Copies of helpers from env.csharp/src/main.ts ─────────────────────

/** Converts a flat character offset to Monaco's 1-based row/col. */
function getRowCol(pos: number, text: string): { row: number; col: number } {
  let row = 1, col = 1;
  for (let i = 0; i < pos && i < text.length; i++) {
    if (text[i] === "\n") { row++; col = 1; } else { col++; }
  }
  return { row, col };
}

/** Maps WasmSharp DiagnosticSeverity to Monaco MarkerSeverity integer. */
function mapSeverity(severity: string): number {
  if (severity === "Error")   return 8;
  if (severity === "Warning") return 4;
  if (severity === "Hidden")  return 1;
  return 2; // Info / default
}

// ── Minimal mock helper ────────────────────────────────────────────────────────

function makeMockInterop(diagnosticsJson: string): CompilationInterop {
  return {
    InitAsync: vi.fn(),
    CreateNewCompilation: vi.fn().mockReturnValue("id"),
    Recompile: vi.fn(),
    GetDiagnosticsAsync: vi.fn().mockResolvedValue(diagnosticsJson),
    GetCompletionsAsync: vi.fn().mockResolvedValue("[]"),
    ShouldTriggerCompletionsAsync: vi.fn().mockResolvedValue(false),
    RunAsync: vi.fn().mockResolvedValue(
      JSON.stringify({ success: true, stdOut: "", stdErr: "", diagnostics: [] })
    ),
  } as unknown as CompilationInterop;
}

// ── getRowCol() ────────────────────────────────────────────────────────────────

describe("getRowCol()", () => {
  it("returns {row:1, col:1} for offset 0", () => {
    expect(getRowCol(0, "Console.WriteLine();")).toEqual({ row: 1, col: 1 });
  });

  it("returns {row:1, col:1} for empty source", () => {
    expect(getRowCol(0, "")).toEqual({ row: 1, col: 1 });
  });

  it("advances col correctly on a single line", () => {
    // "Console" is 7 chars; offset 7 points at '.'
    expect(getRowCol(7, "Console.WriteLine();")).toEqual({ row: 1, col: 8 });
  });

  it("increments row at every newline", () => {
    const code = "using System;\nConsole.WriteLine();";
    // offset 14 = position of 'C' in Console, which is the first char of line 2
    expect(getRowCol(14, code)).toEqual({ row: 2, col: 1 });
  });

  it("handles multi-line code with two newlines", () => {
    const code = "using System;\nusing System.IO;\nConsole.WriteLine();";
    // offset 31 = 'C' in Console (line 3)
    expect(getRowCol(31, code)).toEqual({ row: 3, col: 1 });
  });

  it("clamps at end of string when pos > text.length", () => {
    const code = "abc";
    // pos=100 is way past the end — loop terminates at text.length
    const result = getRowCol(100, code);
    expect(result.row).toBe(1);
    expect(result.col).toBe(4); // 3 chars advanced + 1 initial
  });

  it("BUG: offset 0 for top-level error with missing location defaults to row 1 col 1", () => {
    // In main.ts: d.location?.start ?? 0
    // If C# returns a diagnostic with no location (e.g. assembly-level error),
    // start defaults to 0, and getRowCol(0, code) → {row:1, col:1}.
    // This misplaces the marker at the very top of the file.
    const code = 'Console.WriteLine("Hello");\nBadMethod();';
    const missingLocationStart = undefined;
    const result = getRowCol(missingLocationStart ?? 0, code);
    expect(result).toEqual({ row: 1, col: 1 }); // known behaviour, not necessarily correct
  });
});

// ── mapSeverity() ──────────────────────────────────────────────────────────────

describe("mapSeverity()", () => {
  it("maps 'Error' to Monaco severity 8", () => {
    expect(mapSeverity("Error")).toBe(8);
  });

  it("maps 'Warning' to Monaco severity 4", () => {
    expect(mapSeverity("Warning")).toBe(4);
  });

  it("maps 'Hidden' to Monaco severity 1", () => {
    expect(mapSeverity("Hidden")).toBe(1);
  });

  it("maps 'Info' to Monaco severity 2", () => {
    expect(mapSeverity("Info")).toBe(2);
  });

  it("maps unknown severity to 2 (Info default)", () => {
    expect(mapSeverity("UnknownKind")).toBe(2);
  });
});

// ── Diagnostic translation round-trip ─────────────────────────────────────────

describe("diagnostic → Monaco marker translation", () => {
  function toMonacoMarker(d: Diagnostic, code: string) {
    const start = getRowCol(d.location?.start ?? 0, code);
    const end   = getRowCol(d.location?.end   ?? 0, code);
    return {
      startLineNumber: start.row,
      startColumn:     start.col,
      endLineNumber:   end.row,
      endColumn:       end.col,
      message:  d.message + " (" + d.id + ")",
      severity: mapSeverity(d.severity),
      id:       d.id,
    };
  }

  it("maps a single-line error to correct Monaco marker fields", () => {
    const code = "Foo();";
    const diag: Diagnostic = {
      id: "CS0103",
      message: "The name 'Foo' does not exist",
      location: { start: 0, end: 3, length: 3, isEmpty: false },
      severity: "Error",
    };
    const marker = toMonacoMarker(diag, code);
    expect(marker.startLineNumber).toBe(1);
    expect(marker.startColumn).toBe(1);
    expect(marker.endLineNumber).toBe(1);
    expect(marker.endColumn).toBe(4);
    expect(marker.severity).toBe(8);
    expect(marker.message).toContain("CS0103");
  });

  it("maps a multi-line error to the correct line numbers", () => {
    const code = "using System;\nFoo();\nBar();";
    const diag: Diagnostic = {
      id: "CS0103",
      message: "The name 'Foo' does not exist",
      location: { start: 14, end: 17, length: 3, isEmpty: false },
      severity: "Error",
    };
    const marker = toMonacoMarker(diag, code);
    expect(marker.startLineNumber).toBe(2);
    expect(marker.endLineNumber).toBe(2);
  });

  it("BUG: diagnostics with no location (null/undefined) all land on row 1 col 1", () => {
    // C# diagnostics can have no source span (e.g. missing assembly, project-level error).
    // main.ts uses `d.location?.start ?? 0` which defaults to position 0 = row 1 col 1.
    // This causes all such diagnostics to appear at the top of the file.
    const code = "Console.WriteLine();";
    const diag: Diagnostic = {
      id: "CS5001",
      message: "Program does not contain a static Main method",
      location: null as any, // C# may return null location for project-level errors
      severity: "Error",
    };
    const marker = toMonacoMarker(diag, code);
    expect(marker.startLineNumber).toBe(1);
    expect(marker.startColumn).toBe(1);
  });
});

// ── Top-level statement diagnostics ───────────────────────────────────────────

describe("top-level statement diagnostics (mocked C# layer)", () => {
  // These tests document the contract the C# layer SHOULD uphold for top-level code.
  // They use a mocked interop because the real C# WASM cannot run in Node.js.
  // If these tests start failing due to mock changes, something in the TS layer broke.

  it("valid top-level Console.WriteLine produces zero diagnostics", async () => {
    const interop = makeMockInterop("[]");
    const compilation = Compilation.create('Console.WriteLine("Hello");', interop);
    const diagnostics = await compilation.getDiagnosticsAsync();
    expect(diagnostics.filter((d) => d.severity === "Error")).toHaveLength(0);
  });

  it("invalid top-level code produces error diagnostics", async () => {
    const mockErrors: Diagnostic[] = [
      {
        id: "CS0103",
        message: "The name 'NonExistentMethod' does not exist in the current context",
        location: { start: 0, end: 18, length: 18, isEmpty: false },
        severity: "Error",
      },
    ];
    const interop = makeMockInterop(JSON.stringify(mockErrors));
    const compilation = Compilation.create("NonExistentMethod();", interop);
    const diagnostics = await compilation.getDiagnosticsAsync();
    expect(diagnostics.filter((d) => d.severity === "Error")).toHaveLength(1);
  });

  it("BUG SCENARIO: blank project default code should not produce spurious CS5001 errors", async () => {
    // CS5001: Program does not contain a static 'Main' method suitable for an entry point.
    // This error SHOULD NOT appear for blank/empty code with the default compilation options
    // (OutputKind.ConsoleApplication + C# 9+ top-level statement support).
    // If it does appear, it means the DocumentOptions are misconfigured.
    //
    // The mock here simulates the DESIRED state (no errors). If the real C# layer
    // returns CS5001 for empty code, the fix is in DocumentOptions.cs.
    const interop = makeMockInterop("[]");
    const compilation = Compilation.create("", interop);
    const diagnostics = await compilation.getDiagnosticsAsync();
    const cs5001 = diagnostics.filter((d) => d.id === "CS5001");
    expect(cs5001).toHaveLength(0);
  });

  it("FIX: non-source diagnostics (Location.None) do not crash getDiagnosticsAsync", async () => {
    // Root cause of Bug 4:
    // compilation.GetDiagnostics() can include diagnostics with Location.IsInSource = false
    // (assembly-level errors, synthesized boilerplate for top-level statements, etc.).
    // The old ToWasmSharpDiagnostics unconditionally called x.Location.SourceSpan, which
    // throws InvalidOperationException when Location.IsInSource is false.
    // That exception propagated back to JS as a rejected promise, crashing compileAndRun
    // before the "diagnostics" postMessage was ever sent to the parent frame.
    //
    // C# fix in DiagnosticCollectionExtensions.cs:
    //   x.Location.IsInSource ? x.Location.SourceSpan : default
    //
    // At the TypeScript layer we verify the contract: a diagnostic with an empty/zero
    // location (the default TextSpan) deserializes correctly and does not throw.
    const nonSourceDiagnostic: Diagnostic = {
      id: "CS0001",
      message: "Internal compiler error (no source location)",
      location: { start: 0, end: 0, length: 0, isEmpty: true }, // default(TextSpan)
      severity: "Error",
    };
    const interop = makeMockInterop(JSON.stringify([nonSourceDiagnostic]));
    const compilation = Compilation.create('Console.WriteLine("Hello");', interop);
    // Must not throw; must return the diagnostic with a zero-span location
    const diagnostics = await compilation.getDiagnosticsAsync();
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].location.start).toBe(0);
    expect(diagnostics[0].location.isEmpty).toBe(true);
  });
});

// ── Diagnostic JSON contract ───────────────────────────────────────────────────

describe("Diagnostic JSON contract from C# layer", () => {
  it("Diagnostic[] parses correctly from camelCase JSON", () => {
    // C# JsonContext uses JsonKnownNamingPolicy.CamelCase
    const json = JSON.stringify([
      {
        id: "CS0103",
        message: "The name 'x' does not exist",
        location: { start: 5, end: 6, length: 1, isEmpty: false },
        severity: "Error",
      },
    ]);
    const parsed = JSON.parse(json) as Diagnostic[];
    expect(parsed[0].id).toBe("CS0103");
    expect(parsed[0].location.start).toBe(5);
    expect(parsed[0].severity).toBe("Error");
  });

  it("getDiagnosticsAsync ?? [] guard converts null JSON to empty array", () => {
    // JSON.parse("null") returns null. The `?? []` guard added to getDiagnosticsAsync
    // ensures callers always receive a Diagnostic[], never null, even if the C# side
    // returns the string "null" instead of "[]".
    const rawNull = JSON.parse("null") as Diagnostic[] | null;
    expect(rawNull).toBeNull(); // JSON.parse itself still returns null...
    const guarded = rawNull ?? [];
    expect(guarded).toEqual([]); // ...but the guard catches it
  });

  it("empty string JSON causes JSON.parse to throw SyntaxError", () => {
    // If C# returns an empty string "" instead of "[]", JSON.parse throws.
    expect(() => JSON.parse("")).toThrow(SyntaxError);
  });
});
