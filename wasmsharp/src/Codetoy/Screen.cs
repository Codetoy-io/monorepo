using System.Runtime.InteropServices.JavaScript;

public static partial class Screen
{
    public static double Width = 1;
    public static double Height = 1;
    public static double CenterX = 1;
    public static double CenterY = 1;
    public static double DeltaTime = 1 / 16;
    public static double FPS = 60.0;

    // FPS Calculation Variables
    private static int _frameCount = 0;
    private static double _timeSinceLastSecond = 0.0;
    private static double _lastFPS = 60.0;
    private static Action? _update;

    public static void OnUpdate(Action update)
    {
        _update = update;
    }

    [JSExport]
    internal static void CallUpdate(double deltaTime)
    {
        DeltaTime = deltaTime;

        // FPS Calculation Logic

        _frameCount++;
        _timeSinceLastSecond += deltaTime;


        if (_timeSinceLastSecond >= 1.0)
        {
            _lastFPS = _frameCount / _timeSinceLastSecond;
            FPS = _lastFPS;

            // Reset counters

            _frameCount = 0;
            _timeSinceLastSecond = 0.0;
        }

        _update?.Invoke();
    }

    [JSExport]
    internal static void CallResize(double width, double height)
    {
        CenterX = Width / 2.0;
        CenterY = Height / 2.0;
        Width = width;
        Height = height;
    }

    [JSExport]
    internal static void Reset()
    {
        _update = null;

        // Reset FPS tracking variables

        _frameCount = 0;
        _timeSinceLastSecond = 0.0;
        _lastFPS = 60.0;
    }
}