## Current builds setup (very broken)
Run `pnpm run build` in the terminal which triggers `dotnet publish -c Release` via package.json.

This then runs the build config according to `wasmsharp/src/WasmSharp.Core.cshproj`.

This results in files being outputted to a `wasmsharp/src/Users/abdiellopez/... etc` which are garbage typescript build files and we have to manually delete those each time. The important files actually get written to `env.csharp/src/build/... etc` with the entire build output of the CSharp project being dumped there. You then need to go to `env.csharp/src/build/net10.0/publish/wwwroot/_framework` and copy that folder into `env.csharp/src/_framework` (deleting the previous folder that is already there).

Now instead of doing all of these shenanigans the correct way to do things would be to instead do the following:

Package wasmsharp as it's own package that builds to `wasmsharp/dist` (dist should contain only the build output's from `wwwroot/_framework`). Wasmsharp can then be consumed as a library by the env.csharp project, similar to how `bindings.web` is being consumed by chsarp.codetoy.dev and env.as.

## Application output

Any path passed to dotnet publish is ignored (see https://github.com/dotnet/runtime/issues/94319). Actual runnable output is always in the ./bin/{Configuration}/net8.0/browser-wasm/AppBundle directory.

Added:

  Canvas
    void Triangle(double x1, double y1, double x2, double y2, double x3, double y3);
    void Polygon(double[] points);
    void Font(string family, double size, string weight = "normal");
    void Text(string content, double x, double y);
    double MeasureText(string content);

  Screen
    static double CenterX
    static double CenterY
    static double FPS

Changed (breaking):

  Input:
-   static bool IsMouseDown;
+   static bool IsMouseDown(int button);