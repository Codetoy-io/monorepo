using System.Runtime.InteropServices.JavaScript;

public static partial class Console
{
    [JSImport("console.log", "main.js")] public static partial void Log(string message);
    [JSImport("console.warn", "main.js")] public static partial void Warn(string message);
    [JSImport("console.error", "main.js")] public static partial void Error(string message);
}
