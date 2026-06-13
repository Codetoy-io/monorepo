### **Codetoy.io**

WebAssembly playground with a P5.js style API for C# and AssemblyScript (and eventually luau and python) that runs entirely in your browser.

<img width="1456" height="1000" alt="Screenshot 2026-06-12 at 11 39 59 PM" src="https://github.com/user-attachments/assets/5a509c43-7f95-45ac-821e-7ff953914a39" />

### Libraries

- `env.csharp`: iframe with a postMessage/onmessage API that facilitates running C# attached to an HTML Canvas with the Codetoy API (`@codetoy-io/bindings.web`). Uses customized fork of [JakeYallop/wasmsharp](https://github.com/JakeYallop/wasmsharp).

- `env.as`: iframe with a postMessage/onmessage API that facilitates running AssemblyScript attached to an HTML Canvas with the Codetoy API (`@codetoy-io/bindings.web`)

*IN-PROGRESS*

- `env.luau`: iframe with a postMessage/onmessage API that facilitates running Luau attached to an HTML Canvas with the Codetoy API (`@codetoy-io/bindings.web`). I would need to fork roblox's new official playground:
- https://github.com/luau-lang/playground

- `env.py`: iframe with a postMessage/onmessage API that facilitates running Python attached to an HTML Canvas with the Codetoy API (`@codetoy-io/bindings.web`). Still need to do more research:
  - https://github.com/SardineFish/monaco-pyright-lsp
  - https://simonwillison.net/2026/Mar/9/pluau-wasm-pyodide/
  - https://github.com/vwh/python-playground [demo](https://vwh.github.io/python-playground/)
  - https://pyodide.org/en/stable/
  - https://simonw.github.io/research/monty-wasm-pyodide/demo.html [demo](https://github.com/simonw/research/tree/main/monty-wasm-pyodide)
  - https://dev.to/hasan_53_52/i-built-a-python-ide-that-runs-entirely-in-your-browser-using-webassembly-111e [demo](https://pythcode.netlify.app/)

