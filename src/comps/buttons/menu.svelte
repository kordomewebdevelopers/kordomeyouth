<script>
  import Svg from "$comps/modals/svg.svelte";
  import { hamburgerIcon } from "$lib/client/icons";

  export let dimension = "25";
</script>

<button on:click>
  <Svg ds={hamburgerIcon} {dimension} />
</button>

<style>
  button {
    outline: var(--outline);
    background-color: transparent;
    color: currentColor;
    padding: var(--gap-nano);
    border-radius: var(--radius-sm);
    z-index: 100;
  }
</style>
