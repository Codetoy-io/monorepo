/**
 * codetoy/canvas.ts
 *
 * Drawing API — imported by user sketches and passed directly
 * as the "codetoy/canvas" entry in wasmImports.
 */

import { ctx, _resetCtx, pixelRatio } from "./runtime.js";

// ─── State stack ──────────────────────────────────────────────────────────────

export function reset() { _resetCtx(); drawFill = drawStroke = true; }
export function push()  { ctx.save(); }
export function pop()   { ctx.restore(); }

// ─── Color ────────────────────────────────────────────────────────────────────

let drawFill = true;
let drawStroke = true;
export function noFill()   { drawFill = false; }
export function noStroke() { drawStroke = false; }

export function fill(r: number, g: number, b: number, a = 1.0) {
  drawFill = true;
  ctx.fillStyle = `rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)},${a})`;
}

export function fillStyle(color: string) {
  drawFill = true;
  ctx.fillStyle = color;
}

export function stroke(r: number, g: number, b: number, a = 1.0) {
  drawStroke = true;
  ctx.strokeStyle = `rgba(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)},${a})`;
}

export function strokeStyle(color: string) {
  drawStroke = true;
  ctx.strokeStyle = color;
}

// ─── Line state ───────────────────────────────────────────────────────────────

export function lineWidth(w: number)          { ctx.lineWidth = w; }
export function lineJoin(s: CanvasLineJoin)   { ctx.lineJoin  = s; }
export function lineMiterLimit(l: number)     { ctx.miterLimit = l; }
export function lineCap(s: CanvasLineCap)     { ctx.lineCap   = s; }

// ─── Shapes ───────────────────────────────────────────────────────────────────

export function rect(x: number, y: number, w: number, h: number, r = 0) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.closePath();
  if (drawFill) ctx.fill();
  if (drawStroke) ctx.stroke();
}

export function circle(x: number, y: number, radius: number) {
  ctx.beginPath();
  ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
  ctx.closePath();
  if (drawFill) ctx.fill();
  if (drawStroke) ctx.stroke();
}

export function line(x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  if (drawStroke) ctx.stroke();
}

export function arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise = false) {
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  ctx.closePath();
  if (drawFill) ctx.fill();
  if (drawStroke) ctx.stroke();
}

export function ellipse(x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
  ctx.closePath();
  if (drawFill) ctx.fill();
  if (drawStroke) ctx.stroke();
}

export function triangle(
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  if (drawFill) ctx.fill();
  if (drawStroke) ctx.stroke();
}

export function polygon(points: number[]) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]);
  ctx.closePath();
  if (drawFill) ctx.fill();
  if (drawStroke) ctx.stroke();
}

// ─── Transforms ───────────────────────────────────────────────────────────────

export function scale(x: number, y: number)    { ctx.scale(x, y); }
export function rotate(radians: number)         { ctx.rotate(radians); }
export function translate(x: number, y: number) { ctx.translate(x, y); }
export function resetTransform()                { ctx.resetTransform(); ctx.scale(pixelRatio, pixelRatio); } // need to also reset the scale

// ─── Advanced path ────────────────────────────────────────────────────────────

export function beginPath()  { ctx.beginPath(); }
export function closePath()  { ctx.closePath(); }
export function fillPath()   { ctx.fill(); }
export function strokePath() { ctx.stroke(); }

export function moveTo(x: number, y: number) { ctx.moveTo(x, y); }
export function lineTo(x: number, y: number) { ctx.lineTo(x, y); }

export function bezierCurveTo(
  cp1x: number, cp1y: number,
  cp2x: number, cp2y: number,
  x: number,   y: number,
) { ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y); }

export function quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
  ctx.quadraticCurveTo(cpx, cpy, x, y);
}

// ─── Text ─────────────────────────────────────────────────────────────────────

export function font(family: string, size: number, weight = "normal") {
  ctx.font = `${weight} ${Math.floor(size)}px ${family}`;
}

export function text(content: string, x: number, y: number) {
  ctx.textAlign    = "left";
  ctx.textBaseline = "top";
  ctx.fillText(content, x, y);
}

export function measureText(content: string): number {
  return ctx.measureText(content).width;
}