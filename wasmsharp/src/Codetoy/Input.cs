using System.Runtime.InteropServices.JavaScript;
using System.Collections.Generic;

public static partial class Input
{
    public static double MouseX;
    public static double MouseY;

    private static Action<int>? _mouseUp;
    private static Action<int>? _mouseDown;
    private static Action<string>? _keyDown;
    private static Action<string>? _keyUp;
    private static Action<int, double, double>? _touchStart;
    private static Action<int>? _touchEnd;
    private static Action<int, double, double>? _touchMove;

    private static readonly bool[] MouseButtonStates = new bool[3];
    public static bool IsMouseDown(int button) => MouseButtonStates[button];

    private static readonly HashSet<string> KeyStates = new();
    public static bool IsKeyDown(string key) => KeyStates.Contains(key);

    private static readonly Dictionary<int, (double X, double Y)> TouchPoints = new();
    public static bool IsTouchDown(int id = -1) => id == -1 ? TouchPoints.Count > 0 : TouchPoints.ContainsKey(id);
    public static int TouchCount() => TouchPoints.Count;
    public static double TouchX(int id) => TouchPoints.TryGetValue(id, out var t) ? t.X : -1;
    public static double TouchY(int id) => TouchPoints.TryGetValue(id, out var t) ? t.Y : -1;

    public static void OnMouseUp(Action<int> mouseUp) { _mouseUp = mouseUp; }
    public static void OnMouseDown(Action<int> mouseDown) { _mouseDown = mouseDown; }
    public static void OnKeyUp(Action<string> keyUp) { _keyUp = keyUp; }
    public static void OnKeyDown(Action<string> keyDown) { _keyDown = keyDown; }
    public static void OnTouchStart(Action<int, double, double> touchStart) { _touchStart = touchStart; }
    public static void OnTouchEnd(Action<int> touchEnd) { _touchEnd = touchEnd; }
    public static void OnTouchMove(Action<int, double, double> touchMove) { _touchMove = touchMove; }

    [JSExport] internal static void CallKeyDown(string key) { KeyStates.Add(key); _keyDown?.Invoke(key); }
    [JSExport] internal static void CallKeyUp(string key) { KeyStates.Remove(key); _keyUp?.Invoke(key); }
    [JSExport] internal static void CallMouseUp(int button) { MouseButtonStates[button] = false; _mouseUp?.Invoke(button); }
    [JSExport] internal static void CallMouseDown(int button) { MouseButtonStates[button] = true; _mouseDown?.Invoke(button); }
    [JSExport] internal static void CallMouseMove(double x, double y) { MouseX = x; MouseY = y; }

    [JSExport]
    internal static void CallTouchStart(int id, double x, double y)
    {
        TouchPoints[id] = (x, y);
        _touchStart?.Invoke(id, x, y);
    }

    [JSExport]
    internal static void CallTouchEnd(int id)
    {
        TouchPoints.Remove(id);
        _touchEnd?.Invoke(id);
    }

    [JSExport]
    internal static void CallTouchMove(int id, double x, double y)
    {
        TouchPoints[id] = (x, y);
        _touchMove?.Invoke(id, x, y);
    }

    [JSExport]
    internal static void Reset()
    {
        MouseButtonStates[0] = false;
        MouseButtonStates[1] = false;
        MouseButtonStates[2] = false;
        KeyStates.Clear();
        TouchPoints.Clear();
        _mouseDown = null;
        _mouseUp = null;
        _keyDown = null;
        _keyUp = null;
        _touchStart = null;
        _touchEnd = null;
        _touchMove = null;
        MouseX = 0;
        MouseY = 0;
    }
}