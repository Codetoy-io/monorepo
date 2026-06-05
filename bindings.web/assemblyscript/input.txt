
/** @module codetoy/input */

/** Get the current X coordinate of the mouse in canvas space */
@external("codetoy/input", "mouseX")
export declare function mouseX(): f64;

/** Get the current Y coordinate of the mouse in canvas space */
@external("codetoy/input", "mouseY")
export declare function mouseY(): f64;

/** Check if a mouse button is currently pressed */
@external("codetoy/input", "isMouseDown")
export declare function isMouseDown(button: i32): bool;

/** Check if a mouse button is currently pressed */
@external("codetoy/input", "isKeyDown")
export declare function isKeyDown(key: string): bool;

/** Get the number of active touch points */
@external("codetoy/input", "touchCount")
export declare function touchCount(): i32;

/** Check if any touch is active */
@external("codetoy/input", "isTouchDown")
export declare function isTouchDown(id: i32 = -1): bool;

/** Get the X coordinate of a touch point by identifier */
@external("codetoy/input", "touchX")
export declare function touchX(id: i32): f64;

/** Get the Y coordinate of a touch point by identifier */
@external("codetoy/input", "touchY")
export declare function touchY(id: i32): f64;
