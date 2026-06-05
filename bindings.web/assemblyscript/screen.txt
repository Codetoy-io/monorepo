
/** @module codetoy/screen */

/** Get the current canvas width in pixels */
@external("codetoy/screen", "width")
export declare function width(): f64;

/** Get the current canvas height in pixels */
@external("codetoy/screen", "height")
export declare function height(): f64;

/** Get the X coordinate of the canvas center */
@external("codetoy/screen", "centerX")
export declare function centerX(): f64;

/** Get the Y coordinate of the canvas center */
@external("codetoy/screen", "centerY")
export declare function centerY(): f64;

/** Get the number of frames elapsed since application started */
@external("codetoy/screen", "frameCount")
export declare function frameCount(): i32;

/** Get the current frames per second */
@external("codetoy/screen", "fps")
export declare function fps(): f64;