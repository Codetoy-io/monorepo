<script>
  
</script>


<div class="relative w-full h-full">
  <!-- TOP NAV BAR -->
  <div class="h-10">
    <!-- LOGO -->
    {#if !createMode}
      {#if isInEmbed}
      <a href="/" target="_blank" class="btn btn-square btn-sm absolute left-1 top-1">
        <span class="h-6 w-6 overflow-hidden">
          <img
            src="/press/codetoy.png"
            alt="Codetoy.io"
            class="h-6 w-6 rounded-sm"
          />
        </span>
      </a>
      {:else}
      <a href="/create" class="btn btn-square btn-sm absolute left-1 top-1">
        <span class="h-6 w-6 overflow-hidden">
          <img
            src="/press/codetoy.png"
            alt="Codetoy.io"
            class="h-6 w-6 rounded-sm"
          />
        </span>
      </a>
      {/if}
    {/if}

    <!-- Env toggle (blank create mode only) -->
    {#if createMode}
      <div class="absolute left-1 top-1 w-64 flex gap-1">
        <button
          class="btn btn-sm w-1/2 {env === 'as' ? 'btn-accent' : 'btn-ghost opacity-50'}"
          onclick={() => handleEnvChange('as')}
        >AS</button>
        <button
          class="btn btn-sm w-1/2 {env === 'csharp' ? 'btn-secondary' : 'btn-ghost opacity-50'}"
          onclick={() => handleEnvChange('csharp')}
        >C#</button>
      </div>
    {/if}

    <!-- Project name -->
    {#if !createMode}
      {#if isAuthor}
        <input
          class="fixed input top-0 mt-2 left-10 right-60 w-auto h-6 overflow-hidden text-ellipsis whitespace-nowrap"
          bind:value={currentName}
        />
      {:else}
        <div
          class="fixed top-0 pt-2 left-10 right-60 w-auto h-10 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {currentName}
          <span>
            by
            <a
              target="_blank"
              class="hover:underline inline"
              style="
              padding: 0.1rem 0.4rem;
              border-radius: 0.375rem;
              background-color: #{authorColor};
              color: {getContrastColorWithOpacity(authorColor)};"
              href={author ? "/@" + author.username : "#"}
            >
              @{author ? author.username : "unknown"} ↗
            </a>
          </span>
        </div>
      {/if}
    {/if}

    <div class="absolute right-1 top-1">
      <!-- TODO If the user made a change during a video playback -->
      <!-- <button class="btn btn-sm" title="Back to video">
        <svg
          class="size-4 lucide lucide-undo-icon lucide-undo"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><path d="M3 7v6h6" /><path
            d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"
          /></svg
        >
        <span class="hidden md:inline-block">Back to video</span>
      </button> -->

      {#if !createMode}
        <a class="btn btn-sm" href="/{publicId}/edit"> old editor? </a>
      {/if}

      {#if showSave}
        <button
          class="btn btn-sm"
          title="Save"
          onclick={saveChanges}
          disabled={isSaving}
        >
          {#if isSaving}
            Saving
          {:else}
            Save
          {/if}
        </button>
      {/if}

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
      {#if !createMode}
        {#if session}
          <ProfileDropdown bind:supabase {color} {letter} {currentName} {username}
          ></ProfileDropdown>
        {/if}
        {#if !session && !isInEmbed}
          <SignInWithGoogle
            class="btn btn-sm border-0 btn-ghost outline-0 group bg-base-200 w-24 hover:bg-base-300 dark:bg-white dark:hover:bg-white dark:opacity-100 dark:hover:opacity-100 dark:text-gray-700 px-4 transition-all rounded-lg"
            bind:supabase
          >
            Login
            <img class="h-3" src="/logos/Google.png" alt="Google Sign In" />
          </SignInWithGoogle>
        {/if}
      {/if}
    </div>
  </div>

  <!-- FILES SIDEBAR -->
  <div class="absolute group top-10 right-0 bottom-10 w-2 z-30">
    <div
      class="absolute group-hover:flex hidden top-0 right-1 bottom-12 bg-base-300 shadow-xl rounded-lg w-56 z-10 p-2 flex-col"
    >
      <!-- top bar -->
      <div class="px-1 flex">
        <span class="text-sm mr-auto">FILES</span>

        <button
          class="btn btn-xs btn-square bg-base-100 flex cursor-not-allowed"
          title="New File"
        >
          <svg
            class="size-4 lucide lucide-file-plus-corner-icon lucide-file-plus-corner"
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
              d="M11.35 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5.35"
            /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M14 19h6" /><path
              d="M17 16v6"
            /></svg
          >
        </button>

        <button
          class="btn btn-xs btn-square bg-base-100 flex cursor-not-allowed"
          title="New Folder"
        >
          <svg
            class="size-4 lucide lucide-folder-plus-icon lucide-folder-plus"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path d="M12 10v6" /><path d="M9 13h6" /><path
              d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
            /></svg
          >
        </button>
      </div>

      <!-- files tree -->
      <div
        class="btn btn-xs w-full bg-base-100 items-center justify-start font-mono font-light"
      >
        {#if env === "csharp"}
          <span class="text-green-500">C#</span>Program.cs
        {:else}
          <span class="text-blue-500">AS</span>main.ts
        {/if}
      </div>
      <!-- 
      <div class="bg-base-100 p-2 rounded-lg text-xs mt-5 mb-auto">
        Upgrade to <span class="text-blue-500">dev</span> plan to unlock file storage
        up to 5mb per file.
      </div> -->

      <div class="bg-base-100 p-2 rounded-lg text-xs mt-5 mb-auto">
        <i>Coming soon.</i> File storage up to 5mb per file.
      </div>
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

    {#if !isInEmbed}
      <!-- Recording -->
      {#if recordingContentState === "recording"}
        <button class="btn btn-sm" onclick={stopRecording}>
          <!-- stop recording -->
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
          <!-- start recording -->
          Start Recording
          <!-- <svg
            class="size-4 lucide lucide-mic-icon lucide-mic"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path d="M12 19v3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><rect
              x="9"
              y="2"
              width="6"
              height="13"
              rx="3"
            />
          </svg>
          <span class="text-xs text-base-content/70 pt-1">Record</span> -->
        </button>
        <span class="text-sm px-2"
          >Recording yourself coding to make a tutorial</span
        >
      {/if}
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
