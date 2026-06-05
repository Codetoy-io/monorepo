using System.Globalization;
using Microsoft.CodeAnalysis;

namespace WasmSharp.Core.Services;

public static class DiagnosticCollectionExtensions
{
    public static Diagnostic[] MapDiagnostics(this Microsoft.CodeAnalysis.Diagnostic[] diagnostics)
    {
        return diagnostics.Select(x => new Diagnostic(x.Id, x.GetMessage(CultureInfo.CurrentCulture), x.Location.SourceSpan, x.Severity)).ToArray();
    }

    public static IEnumerable<Diagnostic> ToWasmSharpDiagnostics(this IEnumerable<Microsoft.CodeAnalysis.Diagnostic> diagnostics)
    {
        // Location.SourceSpan throws InvalidOperationException for non-source diagnostics
        // (e.g. assembly-level errors, synthesized top-level statement boilerplate).
        // Default to an empty span at position 0 so serialization never throws.
        return diagnostics.Select(x => new Diagnostic(
            x.Id,
            x.GetMessage(CultureInfo.CurrentCulture),
            x.Location.IsInSource ? x.Location.SourceSpan : default,
            x.Severity));
    }
}
