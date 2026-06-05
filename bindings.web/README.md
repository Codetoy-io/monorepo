### WebGL Support
Codetoy bindings (bindings.web) provides bindings to the Codetoy API for the C# playground (env.csharp) and the AssemblyScript playground (env.as).

If WebGL ever gets added in the future there is many things to consider depending on the route you take to add it.

(option 1) You can add another canvas that goes below the 2D drawing canvas, with the tradeoff being that when recording the canvas you will not be able to record the WebGL part of the canvas.

(option 2) Alternatively you could implement the 2D drawing API within WebGL and then implement the WebGL API so that it can work alongside the existing 2D drawing API. 

This would need to be a non-breaking change to the 2D api... the problem is this means you would have to default to 2D drawing and then somehow either disable 2D drawing whenever you want to access WebGL directly, or somehow make the WebGL API "just work" regardless of any immediate mode 2D drawing that gets mixed in.

Additionally, there is the question of if a new namespace should be made for the WebGL commands, or if they should live alongside the existing "canvas" namespace.

If they share the canvas namespace then it would make sense for certain commands like "reset" to have a duality that allows them to reset not only the 2D drawing state but also reset the WebGL context.

### Option 1
Go with option 1 since it is the simplest and requires less breaking changes