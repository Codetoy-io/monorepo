using System.Runtime.InteropServices.JavaScript;

public static partial class Canvas
{
    // STATE STACK
    [JSImport("context2D.reset", "main.js")] public static partial void Reset();
    [JSImport("context2D.push", "main.js")] public static partial void Push();
    [JSImport("context2D.pop", "main.js")] public static partial void Pop();

    // COLOR STATE
    [JSImport("context2D.noFill", "main.js")] public static partial void NoFill();
    [JSImport("context2D.fill", "main.js")] public static partial void Fill(double r, double g, double b, double a = 1.0);
    [JSImport("context2D.fillStyle", "main.js")] public static partial void FillStyle(string color);
    [JSImport("context2D.noStroke", "main.js")] public static partial void NoStroke();
    [JSImport("context2D.stroke", "main.js")] public static partial void Stroke(double r, double g, double b, double a = 1.0);
    [JSImport("context2D.strokeStyle", "main.js")] public static partial void StrokeStyle(string color);

    // LINE STATE
    [JSImport("context2D.lineWidth", "main.js")] public static partial void LineWidth(double width);
    [JSImport("context2D.lineJoin", "main.js")] public static partial void LineJoin(string joinStyle);
    [JSImport("context2D.lineMiterLimit", "main.js")] public static partial void LineMiterLimit(double limit);
    [JSImport("context2D.lineCap", "main.js")] public static partial void LineCap(string capStyle);

    // SHAPE DRAWING
    [JSImport("context2D.rect", "main.js")] public static partial void Rect(double x, double y, double w, double h, double r = 0.0);
    [JSImport("context2D.circle", "main.js")] public static partial void Circle(double x, double y, double radius);
    [JSImport("context2D.line", "main.js")] public static partial void Line(double x1, double y1, double x2, double y2);
    [JSImport("context2D.ellipse", "main.js")] public static partial void Ellipse(double x, double y, double w, double h);
    [JSImport("context2D.triangle", "main.js")] public static partial void Triangle(double x1, double y1, double x2, double y2, double x3, double y3);
    [JSImport("context2D.polygon", "main.js")] public static partial void Polygon(double[] points);

    // TRANSFORM
    [JSImport("context2D.scale", "main.js")] public static partial void Scale(double x, double y);
    [JSImport("context2D.rotate", "main.js")] public static partial void Rotate(double radians);
    [JSImport("context2D.translate", "main.js")] public static partial void Translate(double x, double y);
    [JSImport("context2D.resetTransform", "main.js")] public static partial void ResetTransform();

    // ADVANCED DRAWING
    [JSImport("context2D.beginPath", "main.js")] public static partial void BeginPath();
    [JSImport("context2D.moveTo", "main.js")] public static partial void MoveTo(double x, double y);
    [JSImport("context2D.lineTo", "main.js")] public static partial void LineTo(double x, double y);
    [JSImport("context2D.bezierCurveTo", "main.js")] public static partial void BezierCurveTo(double cp1x, double cp1y, double cp2x, double cp2y, double x, double y);
    [JSImport("context2D.quadraticCurveTo", "main.js")] public static partial void QuadraticCurveTo(double cpx, double cpy, double x, double y);
    [JSImport("context2D.closePath", "main.js")] public static partial void ClosePath();
    [JSImport("context2D.fillPath", "main.js")] public static partial void FillPath();
    [JSImport("context2D.strokePath", "main.js")] public static partial void StrokePath();

    // TEXT
    [JSImport("context2D.font", "main.js")] public static partial void Font(string family, double size, string weight = "normal");
    [JSImport("context2D.text", "main.js")] public static partial void Text(string content, double x, double y);
    [JSImport("context2D.measureText", "main.js")] public static partial double MeasureText(string content);
}
