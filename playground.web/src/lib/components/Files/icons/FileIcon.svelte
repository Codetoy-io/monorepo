<script lang="ts">
  // import { getIcon } from "material-file-icons";
  // import { getMaterialFileIcon } from "file-extension-icon-js";

  interface Props {
    name: string;
    style?: string;
    class?: string;
  }

  let {name, ...props}: Props = $props();
</script>

<svg {...props} class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5z"/>
</svg>
