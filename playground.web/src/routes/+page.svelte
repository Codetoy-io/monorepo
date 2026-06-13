<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { Playground } from "$lib";
  import { csharpSample } from "$lib/components/CodeEditor/samples";

  let playground: Playground | undefined = $state();

  onMount(() => {
    if (!browser) return;
    playground?.initialize("csharp", csharpSample);
  });
</script>

<div class="h-screen w-screen">
  <Playground bind:this={playground} />
</div>
