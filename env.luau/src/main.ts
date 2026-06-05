// import { LuauState } from "luau-web";

// const body = document.querySelector('body') as HTMLBodyElement;
// const canvas = document.getElementById('canvas') as HTMLCanvasElement;
// const pixelRatio = window.devicePixelRatio || 1;
// var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
// var interval: any;
// var mouseX = 0;
// var mouseY = 0;
// var mouseDown: (button: number) => void;
// var mouseUp:   (button: number) => void;
// var mouseMove: () => void;
// var onResize:  () => void;
// var updateLoop:() => void;
// var lastFrameTime: number = 0;
// var deltaTime: number = 1/60;
// var animationFrame: number;

// const { width, height } = body.getBoundingClientRect();

// const state = await LuauState.createAsync({
//   print: function(...args: any[]) {
//     capturePrint(args);
//   },
//   fill: function(r: number, g: number, b: number, a = 1.0) {
//     ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
//   },
//   rect: function(x: number, y: number, w: number, h: number, r = 0.0) {
//     ctx.beginPath()
//     ctx.roundRect(x * pixelRatio, y * pixelRatio, w * pixelRatio, h * pixelRatio, r)
//     ctx.closePath()
//     ctx!.fill()
//   },
//   circle: function(x: number, y: number, r: number) {
//     ctx.beginPath()
//     ctx.arc(x * pixelRatio, y * pixelRatio, r, 0, Math.PI * 2)
//     ctx.closePath()
//     ctx!.fill()
//   },
//   ellipse: function(x: number, y: number, w: number, h: number) {
//     ctx.beginPath()
//     ctx.ellipse(x * pixelRatio, y * pixelRatio, w * 2 * pixelRatio, h * 2 * pixelRatio, 0, 0, Math.PI * 2)
//     ctx.closePath()
//     ctx!.fill()
//   },
// });

// // Define the JS function to capture the output
// const capturePrint = (...args: any[]) => {
//   // Convert all arguments to strings and join them
//   const output = args.map(String).join(" ");
//   window.parent.postMessage({ env: "lua", type: "output", output: output }, "*");
// };

// // Set a JS function to be a global lua function
// // const { width, height } = body.getBoundingClientRect();
// state.env!.set("mouseX", mouseX, true)
// state.env!.set("mouseY", mouseY, true)
// state.env!.set('width', width, true)
// state.env!.set('height', height, true)
// state.env!.set('deltaTime', deltaTime, true)

// await load();

// // if you uncomment you can see this is the first thing that gets logged
// // Lua loads so fast that we don't detect it loading in time
// // console.log("LUA: postMessage({ env: 'lua', type: 'loaded', loaded: 'success' }, '*');")
// window.postMessage({ env: "lua", type: "loaded", loaded: "success" }, "*");

// async function load() {
//   window.addEventListener("message", async ({data}) => {
//     if (data.type === "code") {
//       if (interval) clearInterval(interval);
//       await runLuaCode(data.code);
//     } else if (data.type === "image") {
//       await sendImageToParent();
//     }
//   })

//   // ResizeObserver to track canvas size changes
//   resizeHandler();
//   function resizeHandler() {
//     const { width, height } = body.getBoundingClientRect();
//     canvas.style.width = width + "px";
//     canvas.style.height = height + "px";
//     canvas.width = width * pixelRatio;
//     canvas.height = height * pixelRatio;
//   }
//   const resizeObserver = new ResizeObserver(() => {
//     resizeHandler();
//     if (onResize) onResize();
//   });
//   resizeObserver.observe(body);
  
//   canvas.addEventListener('mousemove', (event) => {
//     const rect = canvas.getBoundingClientRect();
//     mouseX = event.clientX - rect.left;
//     mouseY = event.clientY - rect.top;
//     if (mouseMove) mouseMove()
//   });
//   canvas.addEventListener('mouseup', (event) => {
//     const rect = canvas.getBoundingClientRect();
//     mouseX = event.clientX - rect.left
//     mouseY = event.clientY - rect.top;
//     if (mouseUp) mouseUp(event.button);
//   });
//   canvas.addEventListener('mousedown', (event) => {
//     const rect = canvas.getBoundingClientRect();
//     mouseX = event.clientX - rect.left
//     mouseY = event.clientY - rect.top;
//     if (mouseDown) mouseDown(event.button);
//   });
// }

// async function sendImageToParent() {
//   if (!canvas) {
//     window.parent.postMessage({
//       env: 'lua',
//       type: 'output',
//       output: '(Lua Env) Failed to send thumnbail. Canvas reference is missing.',
//       kind: 'err'
//     }, '*');
//     return;
//   }

//   const imageBase64 = canvas.toDataURL('image/png')
//   window.parent.postMessage({
//     env: 'lua',
//     type: 'image',
//     image: imageBase64,
//   }, '*');
// }


// async function runLuaCode(code: string) {
//   cancelAnimationFrame(animationFrame);
//   console.log("resetting canvas context");
//   ctx.reset()
//   ctx.clearRect(0, 0, width * pixelRatio, height * pixelRatio)

//   try {
//     console.log('loadstring called')
    
//     // Run a lua string
//     const func = state.loadstring(code, "sketch.luau", true)

//     mouseUp = state.env!.global.get('mouseUp')
//     mouseDown = state.env!.global.get('mouseDown')
//     mouseMove = () => {
//       state.env!.set('mouseX', mouseX, true)
//       state.env!.set('mouseY', mouseY, true)
//     }

//     // Create onResize callback that updates width/height and calls Lua function if defined
//     onResize = () => {
//       const { width, height } = body.getBoundingClientRect();
//       const yesW = state.env!.set('width', width, true)
//       const yesH = state.env!.set('height', height, true)
//       console.log("onResize " + yesW + " width " + width + " " + yesH + " height " + height)
//       const onResizeLua = state.env!.global.get('resize')
//       if (onResizeLua) onResizeLua()
//     }

//     // run initial function
//     func()

//     const update = state.env!.global.get('update')
//     updateLoop = () => {  
//       const currentTime = performance.now();
//       deltaTime = lastFrameTime ? (currentTime - lastFrameTime) / 1000 : 0;
//       lastFrameTime = currentTime;

//       state.env!.set('deltaTime', deltaTime, true)
//       console.log('update called ' + update)
//       if (update) update(deltaTime)
//       animationFrame = requestAnimationFrame(updateLoop)
//     }
//     animationFrame = requestAnimationFrame(updateLoop)
//   } catch (error) {
//     console.error("Lua Error:", error)
//     window.parent.postMessage({ env: "lua", type: "output", output: error, kind: "err" }, "*");
//     cancelAnimationFrame(animationFrame);
//   }
// }

import { LuauState, Mutable } from "luau-web";

console.log("createAsync")

const data = Mutable({
  x: 0,
  y: 0
})

const state = await LuauState.createAsync({
  mouse: data
});

let mouseX = 0;
let mouseY = 0;

// this works!
// state.env!.set("mouseX", mouseX, true)
// state.env!.set("mouseY", mouseY, true)

data.set("mouseX", mouseX)
data.set("mouseX", mouseY)

console.log("loadstring")

const func = state.loadstring(`
print("this is being printed from luau")
-- game/scripting update loop here

function update()
  print("update was called! "..mouse.x)
  -- game/scripting update loop here
end
`, "main.luau", true);

console.log("func()")
const result = func()
console.log(result);

console.log("global update: " + state.env!.global.update);
console.log("global.get() update: " + state.env!.global.get("update"));
const update = state.env!.global.get("update");

update()

setInterval(() => {
  update()
  mouseX++;
  mouseY++;

  // this does NOT work
  data.set("x", mouseX)
  data.set("x", mouseY)
    
  // this also does NOT work
  // state.env!.set("mouseX", mouseX, true)
  // state.env!.set("mouseY", mouseY, true)
}, 200)