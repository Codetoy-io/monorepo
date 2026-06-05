import { describe, it, expect, vi, beforeEach } from "vitest";
import { Compilation } from "../Compilation.js";
import type { CompilationInterop, CompilationId } from "../CompilationInterop.js";
import { CharacterOperation } from "../CompilationInterop.js";
import type { Diagnostic, CompletionItem } from "../index.js";
import { WellKnownTagArrays } from "../index.js";

// Builds a minimal CompilationInterop mock. Override individual methods as needed.
function makeMockInterop(
  overrides: Partial<Record<keyof CompilationInterop, unknown>> = {}
): CompilationInterop {
  return {
    InitAsync: vi.fn().mockResolvedValue(undefined),
    CreateNewCompilation: vi.fn().mockReturnValue("compilation-id-1"),
    Recompile: vi.fn(),
    GetDiagnosticsAsync: vi.fn().mockResolvedValue("[]"),
    GetCompletionsAsync: vi.fn().mockResolvedValue("[]"),
    ShouldTriggerCompletionsAsync: vi.fn().mockResolvedValue(false),
    RunAsync: vi.fn().mockResolvedValue(
      JSON.stringify({ success: true, stdOut: "", stdErr: "", diagnostics: [] })
    ),
    ...overrides,
  } as unknown as CompilationInterop;
}

const HELLO_WORLD = 'Console.WriteLine("Hello, World!");';
const TOP_LEVEL_MULTILINE = `using System;\n\nConsole.WriteLine("Hello");\nConsole.WriteLine("World");`;
const INVALID_CODE = "Foo.Bar.Baz.DoesNotExist();";
const EMPTY_CODE = "";
const COMMENT_ONLY = "// Just a comment";

describe("Compilation.create()", () => {
  it("calls CreateNewCompilation synchronously with the provided code", () => {
    const interop = makeMockInterop();
    Compilation.create(HELLO_WORLD, interop);
    expect(interop.CreateNewCompilation).toHaveBeenCalledOnce();
    expect(interop.CreateNewCompilation).toHaveBeenCalledWith(HELLO_WORLD);
  });

  it("returns a Compilation instance", () => {
    const interop = makeMockInterop();
    const compilation = Compilation.create(HELLO_WORLD, interop);
    expect(compilation).toBeInstanceOf(Compilation);
  });

  it("works with empty string code (blank project default)", () => {
    const interop = makeMockInterop();
    expect(() => Compilation.create(EMPTY_CODE, interop)).not.toThrow();
    expect(interop.CreateNewCompilation).toHaveBeenCalledWith(EMPTY_CODE);
  });

  it("works with comment-only code", () => {
    const interop = makeMockInterop();
    expect(() => Compilation.create(COMMENT_ONLY, interop)).not.toThrow();
  });

  it("works with top-level statement code", () => {
    const interop = makeMockInterop();
    expect(() => Compilation.create(TOP_LEVEL_MULTILINE, interop)).not.toThrow();
  });
});

describe("Compilation.getDiagnosticsAsync()", () => {
  it("returns empty array when server reports no diagnostics", async () => {
    const interop = makeMockInterop({
      GetDiagnosticsAsync: vi.fn().mockResolvedValue("[]"),
    });
    const compilation = Compilation.create(HELLO_WORLD, interop);
    const result = await compilation.getDiagnosticsAsync();
    expect(result).toEqual([]);
  });

  it("calls GetDiagnosticsAsync with the compilationId returned by CreateNewCompilation", async () => {
    const interop = makeMockInterop({
      CreateNewCompilation: vi.fn().mockReturnValue("specific-id-xyz"),
      GetDiagnosticsAsync: vi.fn().mockResolvedValue("[]"),
    });
    const compilation = Compilation.create("", interop);
    await compilation.getDiagnosticsAsync();
    expect(interop.GetDiagnosticsAsync).toHaveBeenCalledWith("specific-id-xyz");
  });

  it("parses and returns a single error diagnostic", async () => {
    const mockDiagnostics: Diagnostic[] = [
      {
        id: "CS0103",
        message: "The name 'Foo' does not exist in the current context",
        location: { start: 0, end: 3, length: 3, isEmpty: false },
        severity: "Error",
      },
    ];
    const interop = makeMockInterop({
      GetDiagnosticsAsync: vi.fn().mockResolvedValue(JSON.stringify(mockDiagnostics)),
    });
    const compilation = Compilation.create(INVALID_CODE, interop);
    const result = await compilation.getDiagnosticsAsync();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("CS0103");
    expect(result[0].severity).toBe("Error");
    expect(result[0].message).toContain("Foo");
  });

  it("parses multiple diagnostics of mixed severity", async () => {
    const mockDiagnostics: Diagnostic[] = [
      {
        id: "CS0618",
        message: "Method is obsolete",
        location: { start: 0, end: 10, length: 10, isEmpty: false },
        severity: "Warning",
      },
      {
        id: "CS0103",
        message: "Name does not exist",
        location: { start: 15, end: 20, length: 5, isEmpty: false },
        severity: "Error",
      },
    ];
    const interop = makeMockInterop({
      GetDiagnosticsAsync: vi.fn().mockResolvedValue(JSON.stringify(mockDiagnostics)),
    });
    const compilation = Compilation.create("some code", interop);
    const result = await compilation.getDiagnosticsAsync();
    expect(result).toHaveLength(2);
    expect(result.filter((d) => d.severity === "Error")).toHaveLength(1);
    expect(result.filter((d) => d.severity === "Warning")).toHaveLength(1);
  });

  it("rejects when GetDiagnosticsAsync returns invalid JSON", async () => {
    const interop = makeMockInterop({
      GetDiagnosticsAsync: vi.fn().mockResolvedValue("not valid json {{{"),
    });
    const compilation = Compilation.create("", interop);
    await expect(compilation.getDiagnosticsAsync()).rejects.toThrow();
  });

  it("rejects when GetDiagnosticsAsync itself rejects", async () => {
    const interop = makeMockInterop({
      GetDiagnosticsAsync: vi.fn().mockRejectedValue(new Error("WASM error")),
    });
    const compilation = Compilation.create("", interop);
    await expect(compilation.getDiagnosticsAsync()).rejects.toThrow("WASM error");
  });

  it("returns [] when GetDiagnosticsAsync returns the JSON string 'null'", async () => {
    // Root cause of Bug 4: C# ToWasmSharpDiagnostics called x.Location.SourceSpan on
    // diagnostics whose Location.IsInSource is false (synthesized top-level statement
    // boilerplate, assembly-level errors, etc.). SourceSpan throws InvalidOperationException
    // for Location.None. That exception propagated back to JS, crashing compileAndRun
    // before any diagnostics postMessage was ever sent to the parent frame.
    //
    // C# fix: guard with x.Location.IsInSource ? x.Location.SourceSpan : default
    // TS fix: getDiagnosticsAsync now returns `get<Diagnostic[]>(raw) ?? []`
    //
    // Concretely: if the JSON string "null" ever arrives (shouldn't now, but as a
    // defensive layer), getDiagnosticsAsync must return [] rather than null.
    const interop = makeMockInterop({
      GetDiagnosticsAsync: vi.fn().mockResolvedValue("null"),
    });
    const compilation = Compilation.create('Console.WriteLine("Hello, World!");', interop);
    const result = await compilation.getDiagnosticsAsync();
    expect(result).toEqual([]);
  });

  // --- Race condition: calling getDiagnosticsAsync before recompileAsync resolves ---
  it("RACE: multiple concurrent getDiagnosticsAsync calls use the same compilationId", async () => {
    let resolveFirst!: (v: string) => void;
    const firstPending = new Promise<string>((res) => {
      resolveFirst = res;
    });

    const interop = makeMockInterop({
      GetDiagnosticsAsync: vi.fn()
        .mockReturnValueOnce(firstPending)
        .mockResolvedValue("[]"),
    });

    const compilation = Compilation.create("", interop);

    const p1 = compilation.getDiagnosticsAsync();
    const p2 = compilation.getDiagnosticsAsync();

    resolveFirst("[]");

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toEqual([]);
    expect(r2).toEqual([]);
    // Both calls used the same compilationId
    expect(interop.GetDiagnosticsAsync).toHaveBeenCalledTimes(2);
    const calls = (interop.GetDiagnosticsAsync as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls[0][0]).toBe(calls[1][0]);
  });

  // --- Bug scenario: blank project triggers diagnostics before project fully loads ---
  it("BLANK PROJECT: empty code returns no errors (not spurious compile errors)", async () => {
    // Regression: blank default project code should not produce error-level diagnostics.
    // If getDiagnosticsAsync returns errors for empty code it means C# is treating
    // the empty file as malformed rather than an empty valid compilation.
    const interop = makeMockInterop({
      GetDiagnosticsAsync: vi.fn().mockResolvedValue("[]"),
    });
    const compilation = Compilation.create(EMPTY_CODE, interop);
    const diagnostics = await compilation.getDiagnosticsAsync();
    const errors = diagnostics.filter((d) => d.severity === "Error");
    expect(errors).toHaveLength(0);
  });
});

describe("Compilation.recompileAsync()", () => {
  it("calls Recompile with the original compilationId and new code", async () => {
    const interop = makeMockInterop({
      CreateNewCompilation: vi.fn().mockReturnValue("comp-id"),
    });
    const compilation = Compilation.create("initial code", interop);
    await compilation.recompileAsync("updated code");
    expect(interop.Recompile).toHaveBeenCalledWith("comp-id", "updated code");
  });

  it("getDiagnosticsAsync after recompileAsync still uses the original compilationId", async () => {
    const interop = makeMockInterop({
      CreateNewCompilation: vi.fn().mockReturnValue("id-stays-same"),
      GetDiagnosticsAsync: vi.fn().mockResolvedValue("[]"),
    });
    const compilation = Compilation.create("old", interop);
    await compilation.recompileAsync("new");
    await compilation.getDiagnosticsAsync();
    expect(interop.GetDiagnosticsAsync).toHaveBeenCalledWith("id-stays-same");
  });

  it("reflects updated diagnostics after recompileAsync", async () => {
    const errDiagnostics: Diagnostic[] = [
      {
        id: "CS0103",
        message: "The name 'X' does not exist",
        location: { start: 0, end: 1, length: 1, isEmpty: false },
        severity: "Error",
      },
    ];
    const interop = makeMockInterop({
      GetDiagnosticsAsync: vi.fn()
        .mockResolvedValueOnce("[]")                        // before recompile: clean
        .mockResolvedValue(JSON.stringify(errDiagnostics)), // after recompile: error
    });
    const compilation = Compilation.create(HELLO_WORLD, interop);

    const before = await compilation.getDiagnosticsAsync();
    expect(before).toHaveLength(0);

    await compilation.recompileAsync(INVALID_CODE);

    const after = await compilation.getDiagnosticsAsync();
    expect(after).toHaveLength(1);
    expect(after[0].severity).toBe("Error");
  });
});

describe("Compilation.run()", () => {
  it("returns a success RunResult", async () => {
    const interop = makeMockInterop({
      RunAsync: vi.fn().mockResolvedValue(
        JSON.stringify({ success: true, stdOut: "Hello\n", stdErr: "", diagnostics: [] })
      ),
    });
    const compilation = Compilation.create(HELLO_WORLD, interop);
    const result = await compilation.run();
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.stdOut).toBe("Hello\n");
    }
  });

  it("returns a failure RunResult with diagnostics when compilation fails", async () => {
    const failureDiagnostics: Diagnostic[] = [
      {
        id: "CS0103",
        message: "Undefined identifier",
        location: { start: 0, end: 3, length: 3, isEmpty: false },
        severity: "Error",
      },
    ];
    const interop = makeMockInterop({
      RunAsync: vi.fn().mockResolvedValue(
        JSON.stringify({
          success: false,
          stdOut: null,
          stdErr: null,
          diagnostics: failureDiagnostics,
        })
      ),
    });
    const compilation = Compilation.create(INVALID_CODE, interop);
    const result = await compilation.run();
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.diagnostics).toHaveLength(1);
      expect(result.diagnostics[0].id).toBe("CS0103");
    }
  });
});

describe("Compilation.getCompletions()", () => {
  it("returns empty array when no completions available", async () => {
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue("[]"),
    });
    const compilation = Compilation.create("Con", interop);
    const completions = await compilation.getCompletions(3);
    expect(completions).toEqual([]);
  });

  it("passes caret position and optional filterText to GetCompletionsAsync", async () => {
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue("[]"),
    });
    const compilation = Compilation.create("Con", interop);
    await compilation.getCompletions(3, "Con");
    expect(interop.GetCompletionsAsync).toHaveBeenCalledWith("compilation-id-1", 3, "Con");
  });

  it("passes caret position without filterText when not provided", async () => {
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue("[]"),
    });
    const compilation = Compilation.create("fb.", interop);
    await compilation.getCompletions(3);
    expect(interop.GetCompletionsAsync).toHaveBeenCalledWith("compilation-id-1", 3, undefined);
  });

  it("uses the compilationId from CreateNewCompilation", async () => {
    const interop = makeMockInterop({
      CreateNewCompilation: vi.fn().mockReturnValue("my-comp-id"),
      GetCompletionsAsync: vi.fn().mockResolvedValue("[]"),
    });
    const compilation = Compilation.create("", interop);
    await compilation.getCompletions(0);
    expect(interop.GetCompletionsAsync).toHaveBeenCalledWith("my-comp-id", 0, undefined);
  });

  it("passes correct caret position for member access after dot", async () => {
    // "framebuffer." is 12 chars — cursor sits at offset 12, right after the dot
    const code = "framebuffer.";
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue("[]"),
    });
    const compilation = Compilation.create(code, interop);
    await compilation.getCompletions(code.length);
    expect(interop.GetCompletionsAsync).toHaveBeenCalledWith("compilation-id-1", 12, undefined);
  });

  it("passes filterText when completing a partially-typed member name", async () => {
    // "framebuffer.Cl" — user typed "Cl", cursor at offset 14
    const code = "framebuffer.Cl";
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue("[]"),
    });
    const compilation = Compilation.create(code, interop);
    await compilation.getCompletions(code.length, "Cl");
    expect(interop.GetCompletionsAsync).toHaveBeenCalledWith("compilation-id-1", 14, "Cl");
  });

  it("returns null when GetCompletionsAsync returns JSON null", async () => {
    // Defensive: if Roslyn serialises null instead of [] the wrapper must not crash
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue("null"),
    });
    const compilation = Compilation.create("", interop);
    const result = await compilation.getCompletions(0);
    expect(result).toBeNull();
  });

  it("rejects when GetCompletionsAsync rejects", async () => {
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockRejectedValue(new Error("WASM completions error")),
    });
    const compilation = Compilation.create("", interop);
    await expect(compilation.getCompletions(0)).rejects.toThrow("WASM completions error");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Completion item shape tests
// These verify that Roslyn-shaped payloads round-trip correctly through the
// JSON deserialisation layer. Mock data reflects what the C# side actually
// emits for the example program (FrameBuffer, Renderer, etc.).
// ─────────────────────────────────────────────────────────────────────────────

// Helper to build a realistic CompletionItem mock
function makeItem(partial: Partial<CompletionItem> & Pick<CompletionItem, "displayText" | "tags">): CompletionItem {
  return {
    filterText: partial.displayText,
    sortText: partial.displayText,
    inlineDescription: "",
    span: { start: 0, end: 0, length: 0, isEmpty: true },
    ...partial,
  };
}

describe("Compilation.getCompletions() - item shapes", () => {
  it("parses a public field completion item correctly", async () => {
    const items: CompletionItem[] = [
      makeItem({
        displayText: "Width",
        inlineDescription: "int FrameBuffer.Width",
        tags: WellKnownTagArrays.FieldPublic,
        span: { start: 40, end: 40, length: 0, isEmpty: true },
      }),
    ];
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue(JSON.stringify(items)),
    });
    const compilation = Compilation.create("var fb = new FrameBuffer(100, 100);\nfb.", interop);
    const result = await compilation.getCompletions(40);

    expect(result).toHaveLength(1);
    expect(result![0].displayText).toBe("Width");
    expect(result![0].inlineDescription).toBe("int FrameBuffer.Width");
    expect(result![0].tags).toEqual(WellKnownTagArrays.FieldPublic);
    expect(result![0].span.isEmpty).toBe(true);
  });

  it("parses a public method completion item correctly", async () => {
    const items: CompletionItem[] = [
      makeItem({
        displayText: "Clear",
        inlineDescription: "void FrameBuffer.Clear(float r, float g, float b, float a)",
        tags: WellKnownTagArrays.MethodPublic,
        span: { start: 40, end: 40, length: 0, isEmpty: true },
      }),
    ];
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue(JSON.stringify(items)),
    });
    const compilation = Compilation.create("fb.", interop);
    const result = await compilation.getCompletions(3);

    expect(result![0].displayText).toBe("Clear");
    expect(result![0].tags).toEqual(WellKnownTagArrays.MethodPublic);
  });

  it("parses mixed field and method completions for a class instance", async () => {
    // Mirrors what Roslyn returns when the cursor is after "framebuffer."
    const items: CompletionItem[] = [
      makeItem({ displayText: "Width",        tags: WellKnownTagArrays.FieldPublic,  inlineDescription: "int FrameBuffer.Width" }),
      makeItem({ displayText: "Height",       tags: WellKnownTagArrays.FieldPublic,  inlineDescription: "int FrameBuffer.Height" }),
      makeItem({ displayText: "ColorTexture", tags: WellKnownTagArrays.FieldPublic,  inlineDescription: "Texture2D FrameBuffer.ColorTexture" }),
      makeItem({ displayText: "DepthBuffer",  tags: WellKnownTagArrays.FieldPublic,  inlineDescription: "float[] FrameBuffer.DepthBuffer" }),
      makeItem({ displayText: "Clear",        tags: WellKnownTagArrays.MethodPublic, inlineDescription: "void FrameBuffer.Clear(...)" }),
      makeItem({ displayText: "SetDepth",     tags: WellKnownTagArrays.MethodPublic, inlineDescription: "void FrameBuffer.SetDepth(...)" }),
      makeItem({ displayText: "GetDepth",     tags: WellKnownTagArrays.MethodPublic, inlineDescription: "float FrameBuffer.GetDepth(...)" }),
    ];
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue(JSON.stringify(items)),
    });
    const compilation = Compilation.create("var fb = new FrameBuffer(100,100);\nfb.", interop);
    const result = await compilation.getCompletions(38);

    expect(result).toHaveLength(7);
    const fields  = result!.filter(i => i.tags[0] === "Field");
    const methods = result!.filter(i => i.tags[0] === "Method");
    expect(fields).toHaveLength(4);
    expect(methods).toHaveLength(3);
    expect(fields.map(f => f.displayText)).toEqual(["Width", "Height", "ColorTexture", "DepthBuffer"]);
  });

  it("span encodes the text-replace range for a partially-typed member name", async () => {
    // User typed "fb.Cl" — span covers "Cl" (offsets 3–5)
    const items: CompletionItem[] = [
      makeItem({
        displayText: "Clear",
        tags: WellKnownTagArrays.MethodPublic,
        span: { start: 3, end: 5, length: 2, isEmpty: false },
      }),
    ];
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue(JSON.stringify(items)),
    });
    const compilation = Compilation.create("fb.Cl", interop);
    const result = await compilation.getCompletions(5);

    expect(result![0].span.start).toBe(3);
    expect(result![0].span.end).toBe(5);
    expect(result![0].span.length).toBe(2);
    expect(result![0].span.isEmpty).toBe(false);
  });

  it("span is empty (zero-width) when cursor is right after dot with no filter text", async () => {
    const items: CompletionItem[] = [
      makeItem({
        displayText: "Initialize",
        tags: WellKnownTagArrays.MethodPublic,
        span: { start: 9, end: 9, length: 0, isEmpty: true },
      }),
    ];
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue(JSON.stringify(items)),
    });
    const compilation = Compilation.create("Renderer.", interop);
    const result = await compilation.getCompletions(9);

    expect(result![0].span.isEmpty).toBe(true);
    expect(result![0].span.start).toBe(result![0].span.end);
  });

  it("parses a static class public method from Renderer", async () => {
    const items: CompletionItem[] = [
      makeItem({ displayText: "Initialize", tags: WellKnownTagArrays.MethodPublic, inlineDescription: "void Renderer.Initialize(int width, int height)" }),
      makeItem({ displayText: "DrawMesh",   tags: WellKnownTagArrays.MethodPublic, inlineDescription: "void Renderer.DrawMesh(Mesh mesh, Matrix4x4 model)" }),
      makeItem({ displayText: "Framebuffer",tags: WellKnownTagArrays.FieldPublic,  inlineDescription: "FrameBuffer Renderer.Framebuffer" }),
    ];
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue(JSON.stringify(items)),
    });
    const compilation = Compilation.create("Renderer.", interop);
    const result = await compilation.getCompletions(9);

    const fb = result!.find(i => i.displayText === "Framebuffer");
    expect(fb).toBeDefined();
    expect(fb!.tags).toEqual(WellKnownTagArrays.FieldPublic);

    const init = result!.find(i => i.displayText === "Initialize");
    expect(init).toBeDefined();
    expect(init!.tags).toEqual(WellKnownTagArrays.MethodPublic);
  });

  it("parses a keyword completion item", async () => {
    const items: CompletionItem[] = [
      makeItem({ displayText: "using",  tags: WellKnownTagArrays.Keyword }),
      makeItem({ displayText: "public", tags: WellKnownTagArrays.Keyword }),
      makeItem({ displayText: "class",  tags: WellKnownTagArrays.Keyword }),
    ];
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue(JSON.stringify(items)),
    });
    const compilation = Compilation.create("", interop);
    const result = await compilation.getCompletions(0);

    expect(result).toHaveLength(3);
    result!.forEach(item => expect(item.tags).toEqual(WellKnownTagArrays.Keyword));
  });

  it("preserves sortText and filterText independently from displayText", async () => {
    // Roslyn sometimes returns a sortText that differs from displayText for ordering
    const raw: CompletionItem[] = [
      {
        displayText: "Width",
        filterText: "Width",
        sortText: "0Width", // leading char to force sort order
        inlineDescription: "int FrameBuffer.Width",
        tags: WellKnownTagArrays.FieldPublic,
        span: { start: 3, end: 3, length: 0, isEmpty: true },
      },
    ];
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn().mockResolvedValue(JSON.stringify(raw)),
    });
    const compilation = Compilation.create("fb.", interop);
    const result = await compilation.getCompletions(3);

    expect(result![0].sortText).toBe("0Width");
    expect(result![0].filterText).toBe("Width");
    expect(result![0].displayText).toBe("Width");
  });

  it("still returns correct items after recompileAsync updates code", async () => {
    const oldItems: CompletionItem[] = [
      makeItem({ displayText: "Width", tags: WellKnownTagArrays.FieldPublic }),
    ];
    const newItems: CompletionItem[] = [
      makeItem({ displayText: "Width",  tags: WellKnownTagArrays.FieldPublic }),
      makeItem({ displayText: "Height", tags: WellKnownTagArrays.FieldPublic }),
    ];
    const interop = makeMockInterop({
      GetCompletionsAsync: vi.fn()
        .mockResolvedValueOnce(JSON.stringify(oldItems))
        .mockResolvedValue(JSON.stringify(newItems)),
    });
    const compilation = Compilation.create("fb.", interop);

    const before = await compilation.getCompletions(3);
    expect(before).toHaveLength(1);

    await compilation.recompileAsync("var fb = new FrameBuffer(100, 100);\nfb.");
    const after = await compilation.getCompletions(38);
    expect(after).toHaveLength(2);
    expect(after!.map(i => i.displayText)).toContain("Height");
  });
});

describe("Compilation.shouldTriggerCompletionsAsync()", () => {
  it("returns false at a position with no trigger context", async () => {
    const interop = makeMockInterop({
      ShouldTriggerCompletionsAsync: vi.fn().mockResolvedValue(false),
    });
    const compilation = Compilation.create("var x = 5;", interop);
    const result = await compilation.shouldTriggerCompletionsAsync(10);
    expect(result).toBe(false);
    expect(interop.ShouldTriggerCompletionsAsync).toHaveBeenCalledWith("compilation-id-1", 10);
  });

  it("returns true when dot is inserted (member access trigger)", async () => {
    const interop = makeMockInterop({
      ShouldTriggerCompletionsAsync: vi.fn().mockResolvedValue(true),
    });
    const compilation = Compilation.create("framebuffer.", interop);
    const result = await compilation.shouldTriggerCompletionsAsync(12, ".", CharacterOperation.Inserted);
    expect(result).toBe(true);
    expect(interop.ShouldTriggerCompletionsAsync).toHaveBeenCalledWith("compilation-id-1", 12, ".", CharacterOperation.Inserted);
  });

  it("returns false when semicolon is inserted (statement terminator)", async () => {
    const interop = makeMockInterop({
      ShouldTriggerCompletionsAsync: vi.fn().mockResolvedValue(false),
    });
    const compilation = Compilation.create("var x = 5;", interop);
    const result = await compilation.shouldTriggerCompletionsAsync(10, ";", CharacterOperation.Inserted);
    expect(result).toBe(false);
  });

  it("returns false when a dot is deleted (not an insert trigger)", async () => {
    const interop = makeMockInterop({
      ShouldTriggerCompletionsAsync: vi.fn().mockResolvedValue(false),
    });
    const compilation = Compilation.create("framebuffer", interop);
    const result = await compilation.shouldTriggerCompletionsAsync(11, ".", CharacterOperation.Deleted);
    expect(result).toBe(false);
  });

  it("passes the compilationId from CreateNewCompilation for both overloads", async () => {
    const interop = makeMockInterop({
      CreateNewCompilation: vi.fn().mockReturnValue("trigger-test-id"),
      ShouldTriggerCompletionsAsync: vi.fn().mockResolvedValue(false),
    });
    const compilation = Compilation.create("x.", interop);

    await compilation.shouldTriggerCompletionsAsync(2);
    expect(interop.ShouldTriggerCompletionsAsync).toHaveBeenCalledWith("trigger-test-id", 2);

    await compilation.shouldTriggerCompletionsAsync(2, ".", CharacterOperation.Inserted);
    expect(interop.ShouldTriggerCompletionsAsync).toHaveBeenCalledWith("trigger-test-id", 2, ".", CharacterOperation.Inserted);
  });

  it("throws TypeError when only character is given without operation", async () => {
    const interop = makeMockInterop();
    const compilation = Compilation.create("", interop);
    // Cast through any to exercise the runtime guard (TypeScript overloads prevent this at compile time)
    await expect((compilation as any).shouldTriggerCompletionsAsync(0, ".", undefined)).rejects.toThrow(TypeError);
  });

  it("throws TypeError when only operation is given without character", async () => {
    const interop = makeMockInterop();
    const compilation = Compilation.create("", interop);
    await expect((compilation as any).shouldTriggerCompletionsAsync(0, undefined, "Insert")).rejects.toThrow(TypeError);
  });
});
