<script lang="ts">
  import { onDestroy, tick } from "svelte";
  import { browser } from "$app/environment";
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import { innerWidth } from "svelte/reactivity/window";
  import CodeEditor from "$lib/components/CodeEditor/component.svelte";
  import Env from "$lib/components/Env/component.svelte";
  import { Files, Console } from "$lib";
  import type { Entry } from "$lib/files";
  import type { Monaco, Editor } from "$lib/components/CodeEditor/types";
  import type { Change } from "$lib/recording";

  // Component refs
  let codeEditor: CodeEditor | undefined = $state();
  let iframe: Env | undefined = $state();
  let filesComponent: Files | undefined = $state();
  let integratedConsole: Console | undefined = $state();

  // Monaco bindable refs
  let monaco: typeof Monaco | undefined = $state();
  let editor: Editor.IStandaloneCodeEditor | undefined = $state();

  // State
  let env: "csharp" | "as" | "lua" = $state("csharp");
  let isExecuting = $state(false);
  let isFullscreen = $state(false);
  let isMobile = $derived(innerWidth.current ? innerWidth.current < 720 : true);
  let verticalEnabled = $state(false);
  $effect(() => { if (isMobile) verticalEnabled = true; });

  // Console logs
  let editorLogs: Array<{ i: number; o: string; k: "err" | "log" | "wrn"; l: number }> = $state([]);

  // Active tab label
  let activeFileName = $state("Program.cs");

  // Recording state (stubs for bottom bar)
  let recordingContentState: "empty" | "recording" | "content" = $state("empty");
  let isPlaying = $state(false);

  // Playback / mouse tracking state
  let currentCursorVisible = $state(true);
  let currentMouseX = $state(0);
  let currentMouseY = $state(0);
  let virtualArea: "code" | "game" | undefined = $state(undefined);
  let virtualMouseX = $state(0);
  let virtualMouseY = $state(0);
  let actions: Change[] = $state([]);
  let currentPlaybackActionIndex = $state(0);

  onDestroy(() => {
    codeEditor?.clearAllModels();
    if (!browser) return;
    window.onbeforeunload = null;
  });

  // ── Initialization ────────────────────────────────────────────────────
  export async function initialize(initialEnv?: "csharp" | "as" | "lua", initialCode?: string) {
    if (!browser) return;
    if (initialEnv) {
      env = initialEnv;
      activeFileName = initialEnv === "csharp" ? "Program.cs" : "main.ts";
    }
    await codeEditor?.initialize(env, () => iframe);
    if (initialCode) editor?.setValue(initialCode);
    await filesComponent?.initialize();
    window.onbeforeunload = () => undefined;
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) isFullscreen = false;
    });
    if (initialCode) {
      await iframe?.waitUntilReady();
      await execute();
    }
  }

  // ── Env callbacks ─────────────────────────────────────────────────────
  function onDiagnostics(diagnostics: any[]) {
    if (!monaco || !editor) return;
    const model = editor.getModel();
    if (model) monaco.editor.setModelMarkers(model, "env", diagnostics);
  }

  // ── Monaco mounted callback ───────────────────────────────────────────
  async function mounted(_monaco: typeof Monaco, _editor: Editor.IStandaloneCodeEditor) {
    monaco = _monaco;
    editor = _editor;
    await codeEditor?.loadMonacoSetup(env);
  }

  // ── Execute / Stop ────────────────────────────────────────────────────
  async function execute() {
    integratedConsole?.writeLog("Execute triggered...", "log");
    const code = editor?.getValue() ?? "";
    try {
      isExecuting = await iframe!.execute(code);
    } catch (err) {
      integratedConsole?.writeLog("An error occurred: " + String(err), "err");
      isExecuting = false;
    }
  }
  async function stop() {
    isExecuting = false;
    iframe?.stop();
  }

  // ── Env switch ────────────────────────────────────────────────────────
  async function handleEnvChange(newEnv: "as" | "csharp" | "lua") {
    if (newEnv === env) return;
    env = newEnv;
    activeFileName = newEnv === "csharp" ? "Program.cs" : "main.ts";
    await tick();
    if (editor && monaco) {
      codeEditor?.resetMonaco();
      await codeEditor?.loadMonacoSetup(newEnv);
    }
    await iframe?.waitUntilReady();
    await execute();
  }

  // ── Files callbacks ───────────────────────────────────────────────────
  function onEntriesReloaded(rootEntry: Entry) {
    codeEditor?.loadAllModels(rootEntry);
  }
  function selectFile(entry: Entry) {
    if (entry.kind !== "file") return;
    activeFileName = entry.name;
    codeEditor?.select(entry);
  }

  // ── Mouse tracking ────────────────────────────────────────────────────
  function handleCodeMouseEnter() { virtualArea = "code"; }
  function handleCodeMouseMove(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    virtualMouseX = e.clientX - rect.left;
    virtualMouseY = e.clientY - rect.top;
  }
  function handleCodeMouseLeave() { virtualArea = undefined; }
  function handleGameMouseEnter() { virtualArea = "game"; }
  function handleGameMouseMove(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    virtualMouseX = e.clientX - rect.left;
    virtualMouseY = e.clientY - rect.top;
  }
  function handleGameMouseLeave() { virtualArea = undefined; }

  // ── Layout ────────────────────────────────────────────────────────────
  function toggleFullscreen() { isFullscreen = !isFullscreen; }

  // ── Recording stubs (bottom bar references these) ─────────────────────
  function startRecording() { recordingContentState = "recording"; }
  function stopRecording() { recordingContentState = "empty"; }
  function startPlaying() { isPlaying = true; }
  function stopPlaying() { isPlaying = false; }
  function deleteRecording() { recordingContentState = "empty"; }
  function downloadRecording() {}
</script>

<div class="relative w-full h-full">
  <!-- TOP NAV BAR -->
  <div class="h-10">
    <!-- Env toggle -->
    <div class="absolute left-1 top-1 flex gap-1">
      <button
        class="btn btn-sm {env === 'as' ? 'btn-accent' : 'btn-ghost opacity-50'}"
        onclick={() => handleEnvChange('as')}
      >AS</button>
      <button
        class="btn btn-sm {env === 'csharp' ? 'btn-secondary' : 'btn-ghost opacity-50'}"
        onclick={() => handleEnvChange('csharp')}
      >C#</button>
      <button
        class="btn btn-sm {env === 'lua' ? 'btn-warning' : 'btn-ghost opacity-50'}"
        onclick={() => handleEnvChange('lua')}
      >Lua</button>
    </div>

    <div class="absolute right-1 top-1">
      <!-- Layout Toggle -->
      <button
        class="btn btn-sm btn-square hidden md:inline-flex"
        title="Toggle Layout"
        onclick={() => (verticalEnabled = !verticalEnabled)}
      >
        {#if verticalEnabled}
          <svg
            class="size-4 lucide lucide-layout-panel-top-icon lucide-layout-panel-top"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><rect width="18" height="7" x="3" y="3" rx="1" /><rect
              width="7"
              height="7"
              x="3"
              y="14"
              rx="1"
            /><rect width="7" height="7" x="14" y="14" rx="1" /></svg
          >
        {:else}
          <svg
            class="size-4 lucide lucide-layout-panel-left-icon lucide-layout-panel-left"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><rect width="7" height="18" x="3" y="3" rx="1" /><rect
              width="7"
              height="7"
              x="14"
              y="3"
              rx="1"
            /><rect width="7" height="7" x="14" y="14" rx="1" /></svg
          >
        {/if}
      </button>

      <!-- <button title="Reload" class="btn btn-sm btn-warning border-none">
        Run
        <svg
          class="size-4 lucide lucide-bug-play-icon lucide-bug-play"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><path
            d="M10 19.655A6 6 0 0 1 6 14v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 3.97"
          /><path
            d="M14 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z"
          /><path d="M14.12 3.88 16 2" /><path
            d="M21 5a4 4 0 0 1-3.55 3.97"
          /><path d="M3 21a4 4 0 0 1 3.81-4" /><path
            d="M3 5a4 4 0 0 0 3.55 3.97"
          /><path d="M6 13H2" /><path d="m8 2 1.88 1.88" /><path
            d="M9 7.13V6a3 3 0 1 1 6 0v1.13"
          /></svg
        >
      </button>
      -->
    </div>
  </div>

  <!-- FILES SIDEBAR -->
  <div class="absolute group top-10 right-0 bottom-10 w-2 z-30">
    <div
      class="absolute group-hover:flex hidden top-0 right-1 bottom-12 bg-base-300 shadow-xl rounded-lg w-56 z-10 flex-col overflow-hidden"
    >
      <Files
        bind:this={filesComponent}
        select={selectFile}
        {onEntriesReloaded}
        onError={(err, op) => integratedConsole?.writeLog(`[files:${op}] ${err.message}`, "err")}
      />
    </div>
  </div>

  <!-- RESIZABLE EDITORS -->
  <div class="absolute top-10 left-0 right-0 bottom-10">
    <div class="absolute right-2 top-0 left-1 bottom-0 rounded-lg">
      <Splitpanes
        style="
          background-color: transparent !important;
          z-index: 0;
          overflow: hidden;
        "
        horizontal={true}
      >
        <Pane>
          <Splitpanes bind:horizontal={verticalEnabled}>
            <Pane minSize={10}>
              {@render gameView()}
            </Pane>
            <Pane size={30} minSize={10}>
              {@render codeView()}
            </Pane>
          </Splitpanes>
        </Pane>
        <Pane snapSize={10} size={6} minSize={6}>
          {@render consoleView()}
        </Pane>
      </Splitpanes>
    </div>
  </div>

  <!-- bottom section footer -->
  <div class="h-10 absolute bottom-0 left-0 right-0 z-20 p-1">
    <!-- Playback  -->
    {#if recordingContentState === "content"}
      <div class="pl-18 h-12">
        {#if isPlaying}
          <button class="btn btn-sm" onclick={stopPlaying}>Stop Playback</button
          >
        {:else}
          <button class="btn btn-sm" onclick={startPlaying}
            >Play Recording</button
          >
        {/if}
        <button class="btn btn-sm btn-error" onclick={deleteRecording}>
          Delete Recording
        </button>
        <button class="btn btn-sm" onclick={downloadRecording}
          >Download Video
        </button>
      </div>
    {/if}

    <!-- Recording -->
    {#if recordingContentState === "recording"}
      <button class="btn btn-sm" onclick={stopRecording}>
        <svg
          class="size-4 lucide lucide-circle-small-icon lucide-circle-small"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><circle cx="12" cy="12" r="6" />
        </svg>
        <span class="text-xs text-base-content/70 pt-1">Stop</span>
      </button>
    {:else}
      <button class="btn btn-sm" onclick={startRecording}>
        Start Recording
      </button>
      <span class="text-sm px-2">Recording yourself coding to make a tutorial</span>
    {/if}
    
    {#if import.meta.env.DEV}
      <div>
        Actions recorded: {actions.length}; Playback index: {currentPlaybackActionIndex}
      </div>
      <div>
        MouseX: {virtualMouseX} MouseY: {virtualMouseY}px; Area: {virtualArea};
      </div>
      <div>
        Current MouseX {currentMouseX}px; Current MouseY {currentMouseY}px
      </div>
    {/if}
  </div>
</div>

{#snippet consoleView()}
  <Console bind:logs={editorLogs} bind:this={integratedConsole}></Console>
{/snippet}

{#snippet gameView()}
  <div
    role="presentation"
    class="flex flex-col gap-2 {isFullscreen
      ? 'fixed z-50 top-0 left-0 right-0 bottom-0 bg-base-100 p-2'
      : 'relative w-full h-full'}"
    onmouseenter={handleGameMouseEnter}
    onmousemove={handleGameMouseMove}
    onmouseleave={handleGameMouseLeave}
  >

    <div class="h-6 flex gap-1 pt-1">
      <button
        onclick={toggleFullscreen}
        title="Fullscreen"
        class="btn btn-xs btn-square ml-auto"
      >
        <svg
          class="size-4 lucide lucide-minimize-icon lucide-minimize"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M8 3v3a2 2 0 0 1-2 2H3" />
          <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
          <path d="M3 16h3a2 2 0 0 1 2 2v3" />
          <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
        </svg>
      </button>

      {#if isExecuting}
        <button title="Play" class="btn btn-xs btn-square" onclick={execute}>
          <svg
            class="size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path
              d="M21 3v5h-5"
            /></svg
          >
        </button>
      {:else}
        <button title="Play" class="btn btn-square btn-xs" onclick={execute}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5 fill-primary"
          >
            <path
              fill-rule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      {/if}

      {#if isExecuting}
        <button title="Stop" class="btn btn-square btn-xs" onclick={stop}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="red"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      {/if}

      <!-- {#if session}
          <ProfileDropdown
            bind:supabase
            {color}
            {letter}
            {authorName}
            {username}
          ></ProfileDropdown>
        {:else}
          <SignInWithGoogle
            class="btn btn-sm border-0 btn-ghost outline-0 group bg-base-200 w-24 hover:bg-base-300 dark:bg-white dark:hover:bg-white dark:opacity-100 dark:hover:opacity-100 dark:text-gray-700 px-4 transition-all rounded-lg"
            bind:supabase
          >
            Login
            <img class="h-3" src="/logos/Google.png" alt="Google Sign In" />
          </SignInWithGoogle>
        {/if} -->
    </div>

    <!-- Video overlay during playback -->
    <div
      class="absolute z-10 inset-0 rounded-lg w-full h-full bg-black pointer-events-none {recordingContentState ===
      'content'
        ? ''
        : 'hidden'}"
    ></div>

    {#if recordingContentState === "content"}
      <div
        class="absolute z-50 inset-0 object-center object-contain pointer-events-none"
      >
        <video class="w-full h-full"></video>
      </div>
    {/if}
    <Env
      class="rounded-lg"
      writeLog={(output, kind) => integratedConsole?.writeLog(output, kind)}
      {onDiagnostics}
      bind:this={iframe}
      {env}
    ></Env>
  </div>
{/snippet}

{#snippet codeView()}
  <div
    role="presentation"
    class="flex flex-col h-full w-full relative"
    >

    <!-- TABS -->
    <div class="flex pb-1">
      <div class="btn group btn-xs mt-1 relative btn-ghost bg-base-300">
        <button>
          {activeFileName}
        </button>

        <button
          title="Close Tab"
          class="bg-base-300 opacity-0 group-hover:opacity-100 p-1 absolute rounded-md right-0.5"
        >
          <svg
            class="size-3 lucide lucide-x-icon lucide-x"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
          >
        </button>
      </div>

      <div class="ml-auto"></div>
    </div>

    <!-- MONACO -->
    <div
      role="presentation"
      class="relative h-full w-full"
      onmouseenter={handleCodeMouseEnter}
      onmousemove={handleCodeMouseMove}
      onmouseleave={handleCodeMouseLeave}
    >
      <!-- Virtual Cursor -->
      {#if currentCursorVisible && recordingContentState === "content"}
        <div style="left: {currentMouseX}px; top: {currentMouseY}px;" class="absolute w-2 h-2 opacity-90 shadow-xl rounded-full bg-red-500 z-100 pointer-events-none"></div>
      {/if}

      <CodeEditor
        bind:this={codeEditor}
        bind:monaco
        bind:editor
        class="h-full w-full bg-base-200"
        {mounted}
      ></CodeEditor>
    </div>
  </div>
{/snippet}

<style lang="postcss">
  @import "tailwindcss";

  :global(.splitpanes__pane) {
    transition: all 0s !important;
    background-color: transparent !important;
    border-radius: var(--radius-md) !important;
  }
  :global(.splitpanes__splitter) {
    background-color: transparent !important;
    border-left: 0px !important;
    border-top: 0px !important;
  }

  :global(
      .splitpanes.default-theme .splitpanes__splitter:before,
      .splitpanes.default-theme .splitpanes__splitter:after
    ) {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: color-mix(
      in oklab,
      var(--color-base-content) 50%,
      transparent
    ) !important;
    transition: none !important;
  }

  :global(.monaco-editor) {
    @apply rounded-lg;
  }

  :global(.monaco-editor .overflow-guard) {
    @apply rounded-lg;
  }

  :global(.monaco-editor .monaco-scrollable-element) {
    @apply rounded-br-lg;
  }

  :global(.monaco-editor .margin) {
    @apply rounded-bl-lg;
  }

  :global(.playback-cursor-label) {
    position: absolute;
    bottom: 100%;
    left: 0;
    color: white;
    font-size: 11px;
    padding: 0 4px;
    border-radius: 3px 3px 3px 0;
    white-space: nowrap;
    line-height: 1.6;
    pointer-events: none;
    user-select: none;
  }

  :global(.playback-cursor-caret) {
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 1.2em;
    animation: playback-blink 1s step-end infinite;
    pointer-events: none;
  }

  @keyframes playback-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  :global(.playback-selection-highlight) {
    background: color-mix(in srgb, var(--playback-author-color, #4f8ef7) 30%, transparent);
    border-radius: 2px;
  }
</style>
