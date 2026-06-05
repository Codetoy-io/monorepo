/**
 * codetoy/input.ts
 *
 * Mouse & keyboard input — imported by user sketches and passed directly
 * as the "codetoy/input" entry in wasmImports.
 */

import {
  mouseX as _mouseX, mouseY as _mouseY,
  mouseButtons, keys,
  touchPoints, isTouching,
} from "./runtime.js";

// Mouse + Keyboard API
export const mouseX      = () => _mouseX;
export const mouseY      = () => _mouseY;
export const isMouseDown = (button = 0) => mouseButtons[button] ?? false;
export const isKeyDown   = (key: string) => keys[key] ?? false;

// Touch API
export const touchCount = () => touchPoints.size;
export const isTouchDown = (id: number) => id === -1 ? isTouching : touchPoints.has(id);
export const touchX = (id: number) => touchPoints.get(id)?.x ?? -1;
export const touchY = (id: number) => touchPoints.get(id)?.y ?? -1;