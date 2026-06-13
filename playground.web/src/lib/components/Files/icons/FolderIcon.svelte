<script lang="ts">
    // import { getIcon } from "material-file-icons";
    // import { getMaterialFolderIcon } from "file-extension-icon-js";

  interface Props {
    name: string;
    style?: string;
    class?: string;
    open?: boolean;
  }

    let { name, open = $bindable(true), ...props }: Props = $props();
</script>


<svg {...props} class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M2 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"/>
</svg>
