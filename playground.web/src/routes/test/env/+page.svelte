<script lang="ts">
  import Env from "$lib/components/Env/component.svelte"  
  let iframe;

  function onDiagnostics() {}
  function onReady() {}
  function writeLog() {}
  let env: "csharp" | "lua" | "as" = "csharp"
</script>

<Env
  {onReady}
  class="rounded-lg"
  {writeLog}
  {onDiagnostics}
  bind:this={iframe}
  {env}
></Env>
    