import { LuaFactory } from 'wasmoon'

// Add this import at the top
import { CanvasRecorder, blobToBase64 } from "./minimal-recording-utils"

// Add this variable with your other globals
let recorder: CanvasRecorder | null = null;

// Initialize a new lua environment factory
// You can pass the wasm location as the first argument, useful if you are using wasmoon on a web environment and want to host the file by yourself
const factory = new LuaFactory()

// Create a standalone lua environment from the factory
const lua = await factory.createEngine()

let isReady = false;

// Define the JS function to capture the output
const capturePrint = (...args:any[]) => {
  // Convert all arguments to strings and join them
  const output = args.map(String).join(" ");
  window.parent.postMessage({ env: "lua", type: "output", output: output }, "*");
};

// UTILS
let canvasState: any = {};
const canvasProps = ['strokeStyle', 'fillStyle', 'globalAlpha', 'lineWidth', 
'lineCap', 'lineJoin', 'miterLimit', 'lineDashOffset', 'shadowOffsetX',
'shadowOffsetY', 'shadowBlur', 'shadowColor', 'globalCompositeOperation', 
'font', 'textAlign', 'textBaseline', 'direction', 'imageSmoothingEnabled'];

function saveCanvas() {
  let state = {}
  for(let prop of canvasProps) {
    canvasState[prop] = ctx[prop];
  }
  return state;
}

function restoreCanvas() {
  for(let prop in canvasState) {
    ctx[prop] = canvasState[prop];
  }
}

function resetCanvas() {  
  if (!ctx) return;
  ctx.reset();
  ctx.resetTransform();
  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.scale(pixelRatio, pixelRatio);
}

function resizeAndResetCanvas(w: number, h: number) {
  if (canvas) {
    saveCanvas();
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w * pixelRatio;
    canvas.height = h * pixelRatio;
    resetCanvas();
    restoreCanvas();
  }
  width = w;
  height = h;
}

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
let pixelRatio = window.devicePixelRatio || 1;
var ctx: CanvasRenderingContext2D;
var interval: number;

var mouseDown: any;
var mouseUp: any;
var mouseMove: any;
var keyDown: any;
var keyUp: any;

var onResize: any;
var updateLoop: any;
var lastFrameTime = 0;
var deltaTime = 0;
var animationFrame: any;
var lastWidth = 0;
var lastHeight = 0;

var mouseX: number = 0;
var mouseY: number = 0;
var mouseButtonStates = [false, false, false]
var keyStates: { [key:string]: boolean } = {}

var width = canvas!.width;
var height = canvas!.height;
var centerX = width * 0.5;
var centerY = height * 0.5;

// Set a JS function to be a global lua function
lua.global.set("print", capturePrint);

// GLOBAL VALUES
lua.global.set('mouseX', 0)
lua.global.set('mouseY', 0)
lua.global.set('centerX', centerX)
lua.global.set('centerY', centerY)
lua.global.set('width', canvas.width)
lua.global.set('height', canvas.height)

// INPUT STATE
lua.global.set('isMouseDown', isMouseDown)
lua.global.set('isKeyDown', isKeyDown)

// STATE STACK
lua.global.set('reset', reset)
lua.global.set('push', push)
lua.global.set('pop', pop)

// COLOR STATE
lua.global.set('fill', fill)
lua.global.set('stroke', stroke)

// LINE STATE
lua.global.set('lineCap', lineCap)
lua.global.set('lineJoin', lineJoin)
lua.global.set('lineWidth', lineWidth)
lua.global.set('lineMiterLimit', lineMiterLimit)

// SHAPES DRAWING
lua.global.set('rect', rect)
lua.global.set('line', line)
lua.global.set('circle', circle)
lua.global.set('ellipse', ellipse)
lua.global.set('triangle', triangle)
lua.global.set('polygon', polygon)

// TRANSFORM
lua.global.set('scale', scale)
lua.global.set('rotate', rotate)
lua.global.set('translate', translate)
lua.global.set('resetTransform', resetTransform)

// ADVANCED DRAWING
lua.global.set('beginPath', beginPath)
lua.global.set('moveTo', moveTo)
lua.global.set('lineTo', lineTo)
lua.global.set('bezierCurveTo', bezierCurveTo)
lua.global.set('quadraticCurveTo', quadraticCurveTo)
lua.global.set('closePath', closePath)
lua.global.set('fillPath', fillPath)
lua.global.set('strokePath', strokePath)

// TEXT
lua.global.set('font', font)
lua.global.set('text', text)
lua.global.set('measureText', measureText)

function ping() {
  window.parent.postMessage({ env: "lua", type: "ping" }, "*");
}

window.addEventListener("message", async ({data}) => {
  if (data.type === "ping") {
    if (isReady) ping();
  }
  if (data.type === "code") {
    if (interval) clearInterval(interval);
    await runLuaCode(data.code);
  } 
  else if (data.type === "image") {
    await sendImageToParent();
  }
  else if (data.type === "stop") {
    await runLuaCode("");
  }
  else if (data.type === "startcapture") {
    if (!canvas) {
      console.log("Lua.dev: canvas missing!", canvas)
      return;
    }
    
    recorder = new CanvasRecorder(canvas);
    await recorder.start(data.fps || 30, data.includeAudio !== false);
    
    window.parent.postMessage({
      env: 'lua',
      type: 'capturestarted'
    }, '*');
  }
  else if (data.type === "stopcapture") {
    if (!recorder) {
      console.log("Lua.dev: recorder missing!", recorder)
      return;
    }

    const videoBlob = await recorder.stop();
    const base64Video = await blobToBase64(videoBlob);
    
    window.parent.postMessage({
      env: 'lua',
      type: 'getcapture',
      video: base64Video
    }, '*');
    
    recorder = null;
  }
})

await load();

isReady = true;

async function load() {
  width = window.innerWidth || 1;
  height = window.innerHeight || 1;
  ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  resizeAndResetCanvas(width, height);
  
  // ResizeObserver to track canvas size changes
  const resizeObserver = new ResizeObserver(() => {
    width = window.innerWidth || 1;
    height = window.innerHeight || 1;
    resizeAndResetCanvas(width, height);
    if (onResize) onResize();
  });
  resizeObserver.observe(window.document.body);
  
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    if (mouseMove) mouseMove();
  });
  canvas.addEventListener('mousedown', (event) => {
    mouseButtonStates[event.button] = true;
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top;
    if (mouseDown) mouseDown(event.button);
  });
  canvas.addEventListener('mouseup', (event) => {
    mouseButtonStates[event.button] = false;
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top;
    if (mouseUp) mouseUp(event.button);
  });
  canvas.addEventListener('keydown', (event) => {
    keyStates[event.key] = true;
    if (keyDown) keyDown(event.key);
  });
  canvas.addEventListener('keyup', (event) => {
    delete keyStates[event.key];
    if (keyUp) keyUp(event.key);
  });
}

async function sendImageToParent() {
  if (!canvas) {
    window.parent.postMessage({
      env: 'lua',
      type: 'output',
      output: '(Lua Env) Failed to send thumnbail. Canvas reference is missing.',
      kind: 'err'
    }, '*');
    return;
  }

  const imageBase64 = canvas.toDataURL('image/png')
  window.parent.postMessage({
    env: 'lua',
    type: 'image',
    image: imageBase64,
  }, '*');
}

async function runLuaCode(code: string) {
  cancelAnimationFrame(animationFrame);
  console.log("resetting canvas context");

  resetCanvas();

  try {
    // Run a lua string
    await lua.doString(code)

    mouseDown = lua.global.get('mouseDown')
    mouseUp = lua.global.get('mouseUp')
    mouseMove = () => {
      lua.global.set('mouseX', mouseX)
      lua.global.set('mouseY', mouseY)
    }
    keyDown = lua.global.get('keyDown')
    keyUp = lua.global.get('keyUp')

    // Create onResize callback that updates width/height and calls Lua function if defined
    onResize = () => {
      if (width !== lastWidth) {
        lua.global.set('centerX', width)
        lua.global.set('width', width)
        lastWidth = width
      }
      if (height !== lastHeight) {
        lua.global.set('centerY', width)
        lua.global.set('height', height)
        lastHeight = height
      }
      const onResizeLua = lua.global.get('resize')
      if (onResizeLua) onResizeLua()
    }
    onResize() // Call once to set initial size

    updateLoop = () => {  
      const currentTime = performance.now();
      deltaTime = lastFrameTime ? (currentTime - lastFrameTime) / 1000 : 0;
      lastFrameTime = currentTime;

      lua.global.set('deltaTime', deltaTime)
      const update = lua.global.get('update')
      if (update) update(deltaTime)
      animationFrame = requestAnimationFrame(updateLoop)
    }
    animationFrame = requestAnimationFrame(updateLoop)
  } catch (error) {
    console.error("Lua Error:", error)
    window.parent.postMessage({ env: "lua", type: "output", output: error, kind: "err" }, "*");
    cancelAnimationFrame(animationFrame);
  }
}

// INPUT STATE
function isMouseDown(button: number) {
  return mouseButtonStates[button] === true;
}
function isKeyDown(key: string) {
  return keyStates[key] === true;
}

// STATE STACK
function reset() {
  resetCanvas()
}
function push() {
  ctx!.save()
}
function pop() {
  ctx!.restore()
}

// COLOR STATE
function fill(r: number, g: number, b: number, a = 1.0) {
  ctx!.fillStyle = "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + a + ")";
}
function stroke(r: number, g: number, b: number, a = 1.0) {
  ctx!.strokeStyle = "rgba(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + "," + a + ")";
}

// LINE STATE
function lineWidth(width: number) {
  ctx!.lineWidth = width;
}
function lineJoin(joinStyle: "round" | "bevel" | "miter") {
  ctx!.lineJoin = joinStyle;
}
function lineMiterLimit(limit: number) {
  ctx!.miterLimit = limit;
}
function lineCap(capStyle: "butt" | "round" | "square") {
  ctx!.lineCap = capStyle
}

// SHAPE DRAWING
function rect(x: number, y: number, w: number, h: number, r = 0.0){
  ctx!.beginPath();
  ctx!.roundRect(x, y, w, h, r);
  ctx!.closePath();
  ctx!.fill();
}
function circle(x: number, y: number, radius: number) {
  ctx!.beginPath();
  ctx!.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
  ctx!.closePath();
  ctx!.fill();
}
function line(x1: number, y1: number, x2: number, y2: number) {
  ctx!.beginPath();
  ctx!.moveTo(x1, y1);
  ctx!.lineTo(x2, y2);
  ctx!.stroke();
}
function ellipse(x: number, y: number, w: number, h: number) {
  ctx!.beginPath();
  ctx!.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
  ctx!.closePath();
  ctx!.fill();
}
function triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
  ctx!.beginPath();
  ctx!.moveTo(x1, y1);
  ctx!.lineTo(x2, y2);
  ctx!.lineTo(x3, y3);
  ctx!.closePath();
  ctx!.fill();
}

function drawPath(points: number[]) {
  if (points.length < 2) {
    return;
  }
  ctx!.beginPath();
  ctx!.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) {
    ctx!.lineTo(points[i], points[i + 1]);
  }
  ctx!.closePath();
  ctx!.fill();
}
function polygon(points: number[]) {
  drawPath(Array.from(points));
}

// TRANSFORM
function scale(x:number, y:number) {
  ctx!.scale(x, y)
}
function rotate(radians: number) {
  ctx!.rotate(radians)
}
function translate(x:number, y:number) {
  ctx!.translate(x, y)
}
function resetTransform() {
  ctx!.resetTransform()
}

// ADVANCED DRAWING
function beginPath() {
  ctx!.beginPath()
}
function moveTo(x: number, y: number) {
  ctx!.moveTo(x, y)
}
function lineTo(x:number, y:number) {
  ctx!.lineTo(x, y)
}
function bezierCurveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number) {
  ctx!.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
}
function quadraticCurveTo(cpx:number, cpy:number, x:number, y:number) {
  ctx!.quadraticCurveTo(cpx, cpy, x, y)
}
function closePath() {
  ctx!.closePath()
}
function fillPath() {
  ctx!.fill()
}
function strokePath() {
  ctx!.stroke()
}

// TEXT
function font(family: string, size: number, weight = "normal") {
  ctx!.font = weight + " " + Math.floor(size) + "px " + family;
}
function text(content: string, x: number, y: number) {  
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx!.fillText(content, x, y);
}
function measureText(content: string): number {
  return ctx!.measureText(content).width;
}