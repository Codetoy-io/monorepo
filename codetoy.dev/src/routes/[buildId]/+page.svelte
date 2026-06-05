<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let title = $derived(page.params.buildId + " - Codetoy Application Provider");
  let description = "Codetoy.io - Code and share experiences right in your browser!";
  let banner = "https://codetoy.io/press/codetoy.png";
  let url = "https://codetoy.io";
  let lightColor = "#ffffff";
  let darkColor = "#161b24";

  onMount(async () => {
    if (!browser) return;

    const { init, setExports, wasmImports } = await import("bindings.web/lib/runtime");

    init({
      container: document.getElementById("app")!,
      clearEachFrame: false,
      onError(err: any) {
        console.error("Runtime error:", err);
      },
    });

    try {
      // Use relative URLs to avoid CSP issues in Discord activities
      // Create blob URLs to work with Discord's CSP which allows blob: protocol
      
      // Fetch and compile wasm
      const wasmResponse = await fetch(`_build/build.wasm`);
      if (!wasmResponse.ok) {
        throw new Error(`Failed to fetch wasm: ${wasmResponse.status} ${wasmResponse.statusText}`);
      }
      const wasmArrayBuffer = await wasmResponse.arrayBuffer();
      const compiled = await WebAssembly.compile(wasmArrayBuffer);

      // Fetch and execute instantiate.js
      const instantiateResponse = await fetch(`_build/instantiate.js`);
      if (!instantiateResponse.ok) {
        throw new Error(`Failed to fetch instantiate.js: ${instantiateResponse.status} ${instantiateResponse.statusText}`);
      }
      const instantiateBlob = await instantiateResponse.blob();
      const instantiateUrl = URL.createObjectURL(instantiateBlob);

      // Dynamically import the instantiate function from blob URL
      const instantiateModule = await import(/* @vite-ignore */ instantiateUrl);
      const instantiate = instantiateModule.instantiate;

      const exports = await instantiate(compiled as BufferSource, wasmImports);
      setExports(exports);

      // Cleanup blob URL
      URL.revokeObjectURL(instantiateUrl);
    } catch (err) {
      console.error("Failed to load and initialize wasm:", err);
      throw err;
    }
  });
</script>

<div id='app' class="bg-black h-screen w-screen"></div>

<svelte:head>
  <title>{title}</title>
  <meta name="title" content="{title}" />
  <meta name="description" content="{description}" />
  <meta name="image" content="{banner}" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:image" content="{banner}" />
  <meta property="og:url" content="{url}" />
  <meta name="twitter:card" content="summary_large_image" />
  
  <link rel="icon" href="/_assets/favicon.svg" />
  <link rel="icon" type="image/png" href="/_assets/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/_assets/favicon.svg" />
  <link rel="shortcut icon" href="/_assets/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/_assets/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="Codetoy" />
  <link rel="manifest" href="/_assets/site.webmanifest" />
  
  <meta name="theme-color" content="{lightColor}" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="{darkColor}" media="(prefers-color-scheme: dark)">
</svelte:head>