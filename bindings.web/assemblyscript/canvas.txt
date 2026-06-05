/** @module codetoy/canvas */

//@ts-ignore

// // STATE STACK
// reset() {
//   ctx.resetTransform();
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.textAlign    = "left";
//   ctx.textBaseline = "top";
//   ctx.scale(pixelRatio, pixelRatio);
// },
// push() {
//   ctx.save()
// },
// pop() {
//   ctx.restore()
// },

@external("codetoy/canvas", "reset")
export declare function reset(): void;

@external("codetoy/canvas", "push")
export declare function push(): void;

@external("codetoy/canvas", "pop")
export declare function pop(): void;

// // COLOR STATE
// fill(r: number, g: number, b: number, a = 1.0) {
//   ctx.fillStyle = "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + a + ")";
// },
// stroke(r: number, g: number, b: number, a = 1.0) {
//   ctx.fillStyle = "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + a + ")";
// },

@external("codetoy/canvas", "fill")
export declare function fill(r: f64, g: f64, b: f64, a: f64 = 1.0): void;

@external("codetoy/canvas", "fillStyle")
export declare function fillStyle(color: string): void;

@external("codetoy/canvas", "stroke")
export declare function stroke(r: f64, g: f64, b: f64, a: f64 = 1.0): void;

@external("codetoy/canvas", "strokeStyle")
export declare function strokeStyle(color: string): void;

@external("codetoy/canvas", "noFill")
export declare function noFill(): void;

@external("codetoy/canvas", "noStroke")
export declare function noStroke(): void;

// // LINE STATE
// lineWidth(width: number) {
//   ctx.lineWidth = width;
// },
// lineJoin(joinStyle: "round" | "bevel" | "miter") {
//   ctx.lineJoin = joinStyle;
// },
// lineMiterLimit(limit: number) {
//   ctx.miterLimit = limit;
// },
// lineCap(capStyle: "butt" | "round" | "square") {
//   ctx.lineCap = capStyle
// },

@external("codetoy/canvas", "lineWidth")
export declare function lineWidth(width: f64): void;

@external("codetoy/canvas", "lineJoin")
export declare function lineJoin(joinStyle: string): void; // "round" | "bevel" | "miter"

@external("codetoy/canvas", "lineMiterLimit")
export declare function lineMiterLimit(limit: f64): void;

@external("codetoy/canvas", "lineCap")
export declare function lineCap(capStyle: string): void;


// // SHAPE DRAWING
// rect(x: number, y: number, w: number, h: number, r = 0.0){
//   ctx.beginPath();
//   ctx.roundRect(x, y, w, h, r);
//   ctx.closePath();
//   ctx.fill();
// },
// circle(x: number, y: number, radius: number) {
//   ctx.beginPath();
//   ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
//   ctx.closePath();
//   ctx.fill();
// },
// line(x1: number, y1: number, x2: number, y2: number) {
//   ctx.beginPath();
//   ctx.moveTo(x1, y1);
//   ctx.lineTo(x2, y2);
//   ctx.closePath();
//   ctx.stroke();
// },
// ellipse(x: number, y: number, w: number, h: number) {
//   ctx.beginPath();
//   ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
//   ctx.closePath();
//   ctx.fill();
// },
// triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
//   ctx.beginPath();
//   ctx.moveTo(x1, y1);
//   ctx.lineTo(x2, y2);
//   ctx.lineTo(x3, y3);
//   ctx.closePath();
//   ctx.fill();
// },
// polygon(points: number[]) {
//   drawPath(Array.from(points));
// },
@external("codetoy/canvas", "rect")
export declare function rect(x: f64, y: f64, width: f64, height: f64, r: f64 = 0.0): void;

@external("codetoy/canvas", "circle")
export declare function circle(x: f64, y: f64, radius: f64): void;

@external("codetoy/canvas", "line")
export declare function line(x1: f64, y1: f64, x2: f64, y2: f64): void;

@external("codetoy/canvas", "arc")
export declare function arc(x: f64, y: f64, radius: f64, startAngle: f64, endAngle: f64, anticlockwise: bool = false): void;

@external("codetoy/canvas", "ellipse")
export declare function ellipse(x: f64, y: f64, w: f64, h: f64): void;

@external("codetoy/canvas", "triangle")
export declare function triangle(x1: f64, y1: f64, x2: f64, y2: f64, x3: f64, y3: f64): void;

@external("codetoy/canvas", "polygon")
export declare function polygon(points: f64[]): void;


// // TRANSFORM
// scale(x:number, y:number) {
//   ctx.scale(x, y)
// },
// rotate(radians: number) {
//   ctx.rotate(radians)
// },
// translate(x:number, y:number) {
//   ctx.translate(x, y)
// },
// resetTransform() {
//   ctx.resetTransform()
// },

@external("codetoy/canvas", "scale")
export declare function scale(x: f64, y: f64): void;

@external("codetoy/canvas", "rotate")
export declare function rotate(radians: f64): void;

@external("codetoy/canvas", "translate")
export declare function translate(x: f64, y: f64): void;

@external("codetoy/canvas", "resetTransform")
export declare function resetTransform(): void;

// // ADVANCED DRAWING
// beginPath() {
//   ctx.beginPath()
// },
// moveTo(x: number, y: number) {
//   ctx.moveTo(x, y)
// },
// lineTo(x:number, y:number) {
//   ctx.lineTo(x, y)
// },
// bezierCurveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number) {
//   ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
// },
// quadraticCurveTo(cpx:number, cpy:number, x:number, y:number) {
//   ctx.quadraticCurveTo(cpx, cpy, x, y)
// },
// closePath() {
//   ctx.closePath()
// },
// fillPath() {
//   ctx.fill()
// },
// strokePath() {
//   ctx.stroke()
// },
@external("codetoy/canvas", "beginPath")
export declare function beginPath(): void;

@external("codetoy/canvas", "moveTo")
export declare function moveTo(x: f64, y: f64): void;

@external("codetoy/canvas", "lineTo")
export declare function lineTo(x: f64, y: f64): void;

@external("codetoy/canvas", "bezierCurveTo")
export declare function bezierCurveTo(cp1x:f64, cp1y:f64, cp2x:f64, cp2y:f64, x:f64, y:f64): void;

@external("codetoy/canvas", "quadraticCurveTo")
export declare function quadraticCurveTo(cpx:f64, cpy:f64, x:f64, y:f64): void;

@external("codetoy/canvas", "closePath")
export declare function closePath(): void;

@external("codetoy/canvas", "fillPath")
export declare function fillPath(): void;

@external("codetoy/canvas", "strokePath")
export declare function strokePath(): void;

// // TEXT
// font(family: string, size: number, weight = "normal") {
//   ctx.font = weight + " " + Math.floor(size) + "px " + family;
// },
// text(content: string, x: number, y: number) {
//   ctx.fillText(content, x, y);
// },
// measureText(content: string): number {
//   return ctx.measureText(content).width;
// }

@external("codetoy/canvas", "font")
export declare function font(family: string, size: f64, weight: string = "normal"): void;

@external("codetoy/canvas", "text")
export declare function text(content: string, x: f64, y: f64): void;

@external("codetoy/canvas", "measureText")
export declare function measureText(content: string): f64;
