/**
 * codetoy/screen.ts
 *
 * Screen/viewport info — imported by user sketches and passed directly
 * as the "codetoy/screen" entry in wasmImports.
 */

import { canvasWidth, canvasHeight, frameCount as _frameCount, startTime } from "./runtime.js";

export const width      = () => canvasWidth;
export const height     = () => canvasHeight;
export const centerX    = () => canvasWidth  / 2;
export const centerY    = () => canvasHeight / 2;
export const frameCount = () => _frameCount;
export const fps        = () => {
  const elapsed = (performance.now() - startTime) / 1000;
  return elapsed > 0 ? _frameCount / elapsed : 0;
};