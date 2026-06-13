<!-- Console.svelte -->
<script lang="ts">
  let { logs = $bindable() }: { logs: Array<{ i: number; o: string; k: "err" | "log" | "wrn"; l: number }> } = $props();

  let logDictionary: { [key: string]: number } = {};

  // ── Filter state ───────────────────────────────────────────────────────────
  let showLog = $state(true);
  let showWrn = $state(true);
  let showErr = $state(true);

  let filtered = $derived(logs.filter(log =>
    (log.k === "log" && showLog) ||
    (log.k === "wrn" && showWrn) ||
    (log.k === "err" && showErr)
  ));

  let errCount = $derived(logs.filter(l => l.k === "err").length);
  let wrnCount = $derived(logs.filter(l => l.k === "wrn").length);
  let logCount = $derived(logs.filter(l => l.k === "log").length);

  // ── Public API ─────────────────────────────────────────────────────────────
  export function clearLogs() {
    logDictionary = {};
    logs = [];
  }

  export function writeLog(output: string, kind: "err" | "log" | "wrn" = "log") {
    const index = logDictionary[output + kind];
    if (index !== undefined) {
      logs[index].l += 1;
    } else {
      const idx = logs.length;
      logDictionary[output + kind] = idx;
      logs.push({ i: idx, o: output, k: kind, l: 1 });
    }
  }
</script>

<div class='w-full h-full relative'>
  <!-- Toolbar -->
  <div class="absolute top-0 left-0 right-0 flex items-center gap-1 px-2 py-1.5 shrink-0 bg-base-300 z-10">
    <!-- Filter toggles -->
    <button
      onclick={() => showErr = !showErr}
      title="Toggle errors"
      class="flex items-center gap-1 px-2 py-1 rounded-md transition-all
        {showErr && errCount > 0
          ? 'bg-red-500/15 text-red-400'
          : 'text-base-content/30 hover:text-base-content/60'}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3.5">
        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/>
      </svg>
      {#if errCount > 0}<span class="tabular-nums">{errCount}</span>{/if}
    </button>

    <button
      onclick={() => showWrn = !showWrn}
      title="Toggle warnings"
      class="flex items-center gap-1 px-2 py-1 rounded-md transition-all
        {showWrn && wrnCount > 0
          ? 'bg-yellow-500/15 text-yellow-400'
          : 'text-base-content/30 hover:text-base-content/60'}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3.5">
        <path fill-rule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 8 5Zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/>
      </svg>
      {#if wrnCount > 0}<span class="tabular-nums">{wrnCount}</span>{/if}
    </button>

    <button
      onclick={() => showLog = !showLog}
      title="Toggle logs"
      class="flex items-center gap-1 px-2 py-1 rounded-md transition-all
        {showLog && logCount > 0
          ? 'bg-base-content/10 text-base-content/70'
          : 'text-base-content/30 hover:text-base-content/60'}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3.5">
        <path fill-rule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 3.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"/>
      </svg>
      {#if logCount > 0}<span class="tabular-nums">{logCount}</span>{/if}
    </button>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- Clear -->
    <button
      onclick={clearLogs}
      title="Clear console"
      disabled={logs.length === 0}
      class="p-1 rounded-md text-base-content/30 hover:text-base-content/70
        disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3.5">
        <path fill-rule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clip-rule="evenodd"/>
      </svg>
    </button>
  </div>

  <!-- Log list -->
  <div class="absolute top-0 left-0 right-0 bottom-0 bg-base-300 scrollable-reverse overflow-y-scroll overflow-x-hidden">
    <div class="snap-to-bottom pb-5 pt-12">
      {#if filtered.length === 0}
        <div class="flex items-center justify-center h-full text-base-content/20 select-none py-8">
          {logs.length === 0 ? "No output yet" : "All filtered out"}
        </div>
      {:else}
        {#each filtered as log (log.i)}
          <div class="group flex items-start gap-2 px-3 py-1.5
            hover:bg-base-content/[0.03] transition-colors
            {log.k === 'err' ? 'bg-red-500/5    border-l-2 border-l-red-500/50'    : ''}
            {log.k === 'wrn' ? 'bg-yellow-500/5 border-l-2 border-l-yellow-400/50' : ''}
            {log.k === 'log' ? 'border-l-2 border-l-transparent'                   : ''}"
          >
            <!-- Log -->
            <div class="flex-1 min-w-0 leading-5 flex flex-row gap-2
              {log.k === 'err' ? 'text-red-400'    : ''}
              {log.k === 'wrn' ? 'text-yellow-300' : ''}
              {log.k === 'log' ? 'text-base-content/80' : ''}"
            >
              <!-- Icon -->
              <span class="shrink-0 mt-[1px]
                {log.k === 'err' ? 'text-red-400'    : ''}
                {log.k === 'wrn' ? 'text-yellow-400' : ''}
                {log.k === 'log' ? 'text-base-content/25' : ''}">
                {#if log.k === 'err'}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3.5">
                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/>
                  </svg>
                {:else if log.k === 'wrn'}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3.5">
                    <path fill-rule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 8 5Zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/>
                  </svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3.5">
                    <path fill-rule="evenodd" d="M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937V13.5a.5.5 0 0 1-1 0v-.5H4.5v.5a.5.5 0 0 1-1 0v-.563A2 2 0 0 1 2 11V5a2 2 0 0 1 2-2h.014A2.25 2.25 0 0 1 6.25 1h3.5a2.25 2.25 0 0 1 2.236 2ZM6.25 2.5a.75.75 0 0 0-.75.75v.25h5v-.25a.75.75 0 0 0-.75-.75h-3.5ZM7 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clip-rule="evenodd"/>
                  </svg>
                {/if}
              </span>
              <!-- Message -->
              <pre class="text-sm">{log.o}</pre>
            </div>

            <!-- Repeat badge -->
            {#if log.l > 1}
              <span class="shrink-0 mt-[1px] min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px]
                font-bold tabular-nums flex items-center justify-center
                {log.k === 'err' ? 'bg-red-500/20    text-red-400'    : ''}
                {log.k === 'wrn' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                {log.k === 'log' ? 'bg-base-content/10 text-base-content/50' : ''}">
                {log.l}
              </span>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

<style>
  /* Make scroll start from the bottom up https://cssence.com/2024/bottom-anchored-scrolling-area/ */
  .scrollable-reverse {
    display: flex;
    flex-direction: column-reverse;
    overflow: auto;
  }
  .snap-to-bottom {
    /* nothing needed here, but this is where the content goes */
  }
</style>