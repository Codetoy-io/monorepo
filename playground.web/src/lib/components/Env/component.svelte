<!-- Env.svelte -->
<script lang="ts">
  import { browser } from "$app/environment";
  import { waitUntil } from "$lib/utils";
  import { onMount } from "svelte";

  let { 
    env, 
    // ready = $bindable(), 
    class: className,
    writeLog,
    onDiagnostics,
    onReady,
  }: {
    class?: string;
    env: "lua" | "csharp" | "as";
    // ready: boolean;
    writeLog: (output: string, kind: "err" | "wrn" | "log" | any) => void;
    onDiagnostics: (diagnostics: any[]) => void;
    onReady: () => void;
  } = $props()

  let iframe: HTMLIFrameElement | undefined = $state(undefined);

  onMount(() => {
    if (!browser) return;

    // Ping the iframe repeatedly until it responds with a "ping" message to establish a connection and know when the environment is ready. 
    // This is needed because the iframe can take an indeterminate amount of time to start up, especially on cold starts.
    let pingInterval: ReturnType<typeof setInterval> | undefined;
    pingInterval = setInterval(() => {
      console.log("Pinging environment iframe...");
      iframe?.contentWindow?.postMessage({ type: "ping" }, "*");
    }, 200);

    window.addEventListener("message", ({data}) => {
      if (data.env !== env) return;
      
      // if (data.type === "ping") {
      //   console.log("Received ping response from environment.");
      //   clearInterval(pingInterval);
      //   pingInterval = undefined;

      //   setTimeout(() => {
      //     console.log("Environment is READY");
      //     writeLog("Environment is ready...", "log");
      //     onReady?.();
      //   }, 100);
      // }
      if (data.type === "ping") {
        clearInterval(pingInterval);
        pingInterval = undefined;

        // Also clear any waitUntilReady interval
        clearInterval(resolveReadyInterval);
        resolveReadyInterval = undefined;

        setTimeout(() => {
          console.log("Environment is READY");
          writeLog("Environment is ready...", "log");
          resolveReadyRequest?.();
          resolveReadyRequest = undefined;
          onReady?.();
        }, 100);
      }
      else if (data.type === "output") {
        if (!writeLog) waitUntil(() => writeLog !== undefined && writeLog !== null)
        writeLog(data.output, data?.kind);
      }
      else if (data.type === "image") 
      {
        clearTimeout(requestImageTimeoutId);
        resolveImageRequest?.(data!.image);
      }
      else if (data.type === "running") 
      {
        clearTimeout(executeTimeoutId);
        resolveExecuteRequest?.(data!.running);
      }
      else if (data.type === "build") 
      {
        clearTimeout(resolveBuildTimeoutId);
        resolveBuildRequest?.(data!.build);

        // // download build["build.wasm"]
        // const wasmUrl = URL.createObjectURL(new Blob([data.build["build.wasm"]], { type: "application/wasm" }));
        // const wasmLink = document.createElement("a");
        // wasmLink.href = wasmUrl;
        // wasmLink.download = "build.wasm";
        // wasmLink.click();
        // URL.revokeObjectURL(wasmUrl);

        // // download build["instantiate.js"]
        // const instantiateUrl = URL.createObjectURL(new Blob([data.build["instantiate.js"]], { type: "text/javascript" }));
        // const instantiateLink = document.createElement("a");
        // instantiateLink.href = instantiateUrl;
        // instantiateLink.download = "instantiate.js";
        // instantiateLink.click();
        // URL.revokeObjectURL(instantiateUrl);
      }
      else if (data.type === "getcapture") 
      {
        clearTimeout(requestVideoTimeoutId);
        resolveVideoRequest?.(data!.video);
      }
      else if (data.type === "capturestarted") 
      {
        writeLog("Recording started", "log");
      }
      else if (data.type === "progress") {
        let progressMSG =
          "CSharp Environment, loading " +
          data.loaded +
          " of " +
          data.total;
        if (data.loaded === data.total) {
          progressMSG = "Ready to run code, loading project...";
        }
        writeLog(progressMSG, "log");
      }
      else if (data.type === "completions") {
        console.log("completions returned", data.completions)
        const resolve = pendingCompletions.get(data.requestId);
        if (resolve) {
          pendingCompletions.delete(data.requestId);
          resolve(data.completions);
        }
      }
      else if (data.type === "diagnostics") {
        // console.warn(data.diagnostics);
        onDiagnostics?.(data.diagnostics);
      }
    })
  })

  // IFrame polling and messaging timeouts
  const MAX_SECONDS_TILL_TIMEOUT = 5;

  // Image request
  let resolveImageRequest: undefined | ((base64ImageData: string) => void);
  let requestImageTimeoutId: any;

  // Video recording
  let resolveVideoRequest: undefined | ((base64Video: string) => void);
  let requestVideoTimeoutId: any;
  
  // Execute requests
  let resolveExecuteRequest: undefined | ((running: boolean) => void);
  let executeTimeoutId: any;

  let resolveReadyRequest: (() => void) | undefined;
  let resolveReadyInterval: ReturnType<typeof setInterval> | undefined;

export function waitUntilReady(): Promise<void> {
  return new Promise((resolve) => {
    resolveReadyRequest = resolve;
    function tryPing(attemptsLeft: number) {
      if (!resolveReadyRequest) return;
      iframe?.contentWindow?.postMessage({ type: "ping" }, "*");
      if (attemptsLeft > 0) setTimeout(() => tryPing(attemptsLeft - 1), 200);
    }
    tryPing(25); // retry up to ~5 seconds
  });
}

  export async function getThumbnail(): Promise<string | undefined> {
    console.log("getThumbnail");
    if (!iframe) {
      writeLog("Could not get thumbnail. Iframe missing.", "err");
      return Promise.resolve(undefined);
    }
    iframe!.contentWindow!.postMessage({ type: "image" }, "*");

    return new Promise((resolve, reject) => {
      resolveImageRequest = resolve;
      requestImageTimeoutId = setTimeout(() => {
        writeLog("Could not get thumbnail. Request timed out.", "err");
        reject(undefined);
      }, MAX_SECONDS_TILL_TIMEOUT * 1000);
    });
  }

  export async function startRecording(fps: number = 30): Promise<void> {
    // if (env !== "as") {
    //   writeLog("Recording only available for AssemblyScript environment.", "err");
    //   return;
    // }
    if (!iframe) {
      writeLog("Could not start recording. Iframe missing.", "err");
      return;
    }
    iframe!.contentWindow!.postMessage({ 
      type: "startcapture", 
      fps,
      includeAudio: true,
    }, "*");
  }

  export async function getRecording(): Promise<string | undefined> {
    // if (env !== "as") {
    //   writeLog("Recording only available for AssemblyScript environment.", "err");
    //   return Promise.resolve(undefined);
    // }
    console.log("Env.svelte: stopping recording")
    if (!iframe) {
      writeLog("Could not stop recording. Iframe missing.", "err");
      return Promise.resolve(undefined);
    }
    
    console.log("Env.svelte: postMessage 'stopcapture'")
    iframe!.contentWindow!.postMessage({ type: "stopcapture" }, "*");
    
    return new Promise((resolve, reject) => {
      resolveVideoRequest = resolve;
      requestVideoTimeoutId = setTimeout(() => {
        writeLog("Could not get recording. Request timed out.", "err");
        reject(undefined);
      }, MAX_SECONDS_TILL_TIMEOUT * 1000);
    });
  }

  export async function execute(code: string): Promise<boolean> {
    console.log("execute");
    if (!iframe) {
      writeLog("Could not execute code. Iframe missing.", "err");
      return Promise.resolve(false);
    }
    iframe!.contentWindow!.postMessage({ type: "code", code }, "*");

    return new Promise((resolve, reject) => {
      resolveExecuteRequest = resolve;
      executeTimeoutId = setTimeout(() => {
        writeLog("Could not execute code. Request timed out.", "err");
        reject(false);
      }, MAX_SECONDS_TILL_TIMEOUT * 1000);
    });
  }

  export function stop() {
    iframe!.contentWindow!.postMessage({ type: "stop" }, "*")
  }

  export function reload() {
    // TODO reload iframe?
  }

  // At the moment this only works for C#
  export function lintCode(code: string) {
    iframe!.contentWindow!.postMessage({type: "lint", code }, "*")
  }

  // Completion requests
  let pendingCompletions = new Map<number, (items: any[]) => void>();
  let nextCompletionRequestId = 0;

  export function getCompletions(caretOffset: number, code: string): Promise<any[]> {
    const requestId = nextCompletionRequestId++;
    iframe!.contentWindow!.postMessage({ type: "completions", caretOffset, code, requestId }, "*");
    return new Promise((resolve) => {
      pendingCompletions.set(requestId, resolve);
    });
  }

  // Image request
  const MAX_BUILD_SECONDS = 5;
  let resolveBuildRequest: undefined | ((value: { [key: string]: string | Uint8Array }) => void);
  let resolveBuildTimeoutId: any;
  export function getBuild(): Promise<{ [key: string]: string | Uint8Array }> {
    if (env !== "as") {
      writeLog("Builds are only available for AssemblyScript", "err")
      return Promise.resolve({});
    }

    iframe!.contentWindow!.postMessage({type: "build" }, "*");
    
    // returns the files needed from the iframe (build.wasm, instantiate function that does glue code between AS <-> JS)
    // we have to figure out the index.html and build.js ourselves
    // this also incudes the bindings.web being integrated with build.js
    // may need esbuild.wasm for this?

    // we also want to inject our own custom code that allows an overlay with friends join features
    // this will become important later

    return new Promise((resolve, reject) => {
      resolveBuildRequest = resolve;
      resolveBuildTimeoutId = setTimeout(() => {
        writeLog("Could not get build. Request timed out.", "err");
        reject(undefined);
      }, MAX_BUILD_SECONDS * 1000);
    });
  }
</script>

{#if env === "lua"}
  {#if import.meta.env.DEV}
    <!-- Change this to whatever local URL you are using for lua.codetoy.dev -->
    <iframe
      sandbox="allow-scripts allow-popups allow-same-origin allow-forms"
      allow="camera; fullscreen; microphone;"
      bind:this={iframe}
      title="Lua Runtime"
      allowtransparency={true}
      class="h-full w-full z-0 relative {className}"
      src="http://localhost:5176/"
      frameborder="0"
    ></iframe>
  {:else}
    <iframe
      sandbox="allow-scripts allow-popups allow-same-origin allow-forms"
      allow="camera; fullscreen; microphone;"
      bind:this={iframe}
      title="Lua Runtime"
      allowtransparency={true}
      class="h-full w-full z-0 relative {className}"
      src="https://lua-codetoy-dev.abdiellopez.workers.dev/"
      frameborder="0"
    ></iframe>
  {/if}
{:else if env === "csharp"}
  {#if import.meta.env.DEV}
    <!-- Change this to whatever local URL you are using for env.csharp -->
    <iframe
      sandbox="allow-scripts allow-popups allow-same-origin allow-forms"
      allow="camera; fullscreen; microphone;"
      bind:this={iframe}
      title="CSharp Runtime"
      allowtransparency={true}
      class="h-full w-full z-0 relative {className}"
      src="http://localhost:5175/"
      frameborder="0"
    ></iframe>
  {:else}
    <iframe
      sandbox="allow-scripts allow-popups allow-same-origin allow-forms"
      allow="camera; fullscreen; microphone;"
      bind:this={iframe}
      title="CSharp Runtime"
      allowtransparency={true}
      class="h-full w-full z-0 relative {className}"
      src="https://csharp-codetoy-dev.abdiellopez.workers.dev/"
      frameborder="0"
    ></iframe>
  {/if}
{:else if env === "as"}
  {#if import.meta.env.DEV}
    <iframe
      sandbox="allow-scripts allow-popups allow-same-origin allow-forms"
      allow="camera; fullscreen; microphone;"
      bind:this={iframe}
      title="env.as"
      allowtransparency={true}
      class="w-full h-full z-0 relative {className}"
      src="http://localhost:5174/"
      frameborder="0"
    ></iframe>
  {:else}
    <iframe
      sandbox="allow-scripts allow-popups allow-same-origin allow-forms"
      allow="camera; fullscreen; microphone;"
      bind:this={iframe}
      title="env.as"
      allowtransparency={true}
      class="w-full h-full z-0 relative {className}"
      src="https://as-codetoy-dev.abdiellopez.workers.dev/"
      frameborder="0"
    ></iframe>
  {/if}
{/if}