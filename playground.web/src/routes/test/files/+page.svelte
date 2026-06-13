<script lang="ts">
  import { Files } from "$lib";
  import type { Entry } from "$lib/files";

  function select(entry: Entry) {
    console.log(entry)
  }
</script>

<h1 class="text-3xl font-bold p-3">File Viewer</h1>

<Files
  {select}
></Files>