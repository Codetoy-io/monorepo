/**
 * codetoy/runtime.ts
 *
 * Internal runtime layer — used only by the playground host.
 * Owns the canvas, event listeners, and animation loop.
 * User sketches never import from here directly.
 */

import * as canvasModule from "./canvas.js";
import * as screenModule from "./screen.js";
import * as timeModule from "./time.js";
import * as inputModule from "./input.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WasmExports {
  update?: () => void;
  resize?: (w: number, h: number) => void;
  onMouseDown?: (btn: number) => void;
  onMouseUp?: (btn: number) => void;
  onKeyDown?: (key: string) => void;
  onKeyUp?: (key: string) => void;
  onTouchStart?: (id: number, x: number, y: number) => void;
  onTouchEnd?: (id: number) => void;
  onTouchMove?: (id: number, x: number, y: number) => void;
}

export interface RuntimeOptions {
  container?: HTMLElement;
  clearEachFrame?: boolean;
  showFocusOverlay?: boolean;
  onError?: (err: unknown) => void;
}

// ─── Internal state ───────────────────────────────────────────────────────────

export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;

export let canvasWidth = 400;
export let canvasHeight = 400;
export let pixelRatio = window.devicePixelRatio || 1;

export let startTime = 0;
export let lastFrame = 0;
export let frameCount = 0;
export let cachedDelta = 0;

export let touchPoints: Map<number, { x: number, y: number }> = new Map();
export let primaryTouchX = 0;
export let primaryTouchY = 0;
export let isTouching = false;

export let mouseX = 0;
export let mouseY = 0;
export let mouseButtons: boolean[] = [false, false, false];
export let keys: Record<string, boolean> = {};

let _wasmExports: WasmExports | null = null;
let _animId: number = 0;
let _clearEachFrame = true;
let _onError: (err: unknown) => void = console.error;
let _running = false;
let _focusOverlay: HTMLElement | null = null;
let _showFocusOverlay = true;

// ─── Public runtime API ───────────────────────────────────────────────────────

/** Call once to set up the canvas and start the loop. */
export function init(opts: RuntimeOptions = {}): HTMLCanvasElement {
  const container = opts.container ?? document.body;
  _clearEachFrame = opts.clearEachFrame ?? true;
  _showFocusOverlay = opts.showFocusOverlay ?? true;
  _onError = opts.onError ?? console.error;

  canvas = document.createElement("canvas");
  canvas.setAttribute("tabindex", "0");
  canvas.style.cssText = "display:block;outline:none;top:0;left:0;position:absolute;";
  container.innerHTML = "";
  container.appendChild(canvas);

  // ── Focus overlay ──────────────────────────────────────────────────────────
  if (_showFocusOverlay) {
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    _focusOverlay = document.createElement("div");
    _focusOverlay.style.cssText = [
      "position:absolute",
      "inset:0",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "pointer-events:none",
      "opacity:0",
      "transition:opacity 0.15s ease",
      "background:rgba(0,0,0,0.45)",
      "z-index:10",
    ].join(";");

    const pill = document.createElement("div");
    pill.style.cssText = [
      "margin:auto",
      "width:max-content",
      "height:min-content",
      "color:#fff",
      "font:600 14px/1 system-ui,sans-serif",
      "letter-spacing:0.01em",
      "user-select:none",
      "text-align:center",
      "background-color:transparent",
    ].join(";");
    pill.textContent = "Click to focus";

    _focusOverlay.appendChild(pill);
    container.appendChild(_focusOverlay);
  }
  // ──────────────────────────────────────────────────────────────────────────

  ctx = canvas.getContext("2d")!;

  const { width, height } = container.getBoundingClientRect();
  _resize(width || 400, height || 400);

  _setupEvents(container);

  // canvas.focus();

  startTime = performance.now();
  lastFrame = startTime;
  frameCount = 0;
  _running = true;

  _loop();

  return canvas;
}

/**
 * Swap in a fresh set of WASM exports after each recompile.
 * The loop and event listeners keep running uninterrupted.
 */
export function setExports(e: WasmExports | null) {
  _wasmExports = e;
}

/** The static imports object to pass to every instantiate() call. */
export const wasmImports = {
  "codetoy/canvas": canvasModule,
  "codetoy/screen": screenModule,
  "codetoy/time": timeModule,
  "codetoy/input": inputModule,
};

/** Stop the render loop. */
export function stop() {
  cancelAnimationFrame(_animId);
  _running = false;
}

/** Resume the render loop if stopped. */
export function start() {
  if (_running) return;
  _running = true;
  lastFrame = performance.now();
  _loop();
}

// ─── Loop ─────────────────────────────────────────────────────────────────────

function _loop() {
  if (!_running) return;

  const now = performance.now();
  cachedDelta = (now - lastFrame) / 1000;
  lastFrame = now;

  if (_clearEachFrame) _resetCtx();

  try {
    _wasmExports?.update?.();
  } catch (e) {
    _onError(e);
  }

  frameCount++;
  _animId = requestAnimationFrame(_loop);
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────

export function _resetCtx() {
  ctx.reset();
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.scale(pixelRatio, pixelRatio);
}

function _resize(w: number, h: number) {
  pixelRatio = window.devicePixelRatio || 1;
  canvasWidth = w;
  canvasHeight = h;
  canvas.width = w * pixelRatio;
  canvas.height = h * pixelRatio;
  _resetCtx();
}

// ─── Events ───────────────────────────────────────────────────────────────────

function _setupEvents(container: HTMLElement) {
  canvas.addEventListener("mousemove", e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });

  canvas.addEventListener("mousedown", e => {
    mouseButtons[e.button] = true;
    try { _wasmExports?.onMouseDown?.(e.button); } catch (e) { _onError(e); }
  });

  canvas.addEventListener("mouseup", e => {
    mouseButtons[e.button] = false;
    try { _wasmExports?.onMouseUp?.(e.button); } catch (e) { _onError(e); }
  });

  canvas.addEventListener("keydown", e => {
    keys[e.key] = true;
    try { _wasmExports?.onKeyDown?.(e.key); } catch (e) { _onError(e); }
  });

  canvas.addEventListener("keyup", e => {
    delete keys[e.key];
    try { _wasmExports?.onKeyUp?.(e.key); } catch (e) { _onError(e); }
  });

  canvas.addEventListener("focus", () => {
    if (_focusOverlay) _focusOverlay.style.opacity = "0";
  });
  canvas.addEventListener("blur", () => {
    if (_focusOverlay) _focusOverlay.style.opacity = "1";
  });

  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    for (const t of e.changedTouches) {
      touchPoints.set(t.identifier, { x: t.clientX - r.left, y: t.clientY - r.top });
    }
    isTouching = true;
    for (const t of e.changedTouches) {
      try { _wasmExports?.onTouchStart?.(t.identifier, t.clientX - r.left, t.clientY - r.top); } catch (e) { _onError(e); }
    }
  }, { passive: false });

  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    for (const t of e.changedTouches) {
      const x = t.clientX - r.left, y = t.clientY - r.top;
      touchPoints.set(t.identifier, { x, y });
      try { _wasmExports?.onTouchMove?.(t.identifier, x, y); } catch (e) { _onError(e); }
    }
  }, { passive: false });

  canvas.addEventListener("touchend", e => {
    e.preventDefault();
    for (const t of e.changedTouches) {
      touchPoints.delete(t.identifier);
      try { _wasmExports?.onTouchEnd?.(t.identifier); } catch (e) { _onError(e); }
    }
    isTouching = touchPoints.size > 0;
  }, { passive: false });

  new ResizeObserver(() => {
    const { width, height } = container.getBoundingClientRect();
    _resize(width, height);
    try { _wasmExports?.resize?.(width, height); } catch (e) { _onError(e); }
  }).observe(container);
}