<script>
  import Svg from "$comps/modals/svg.svelte";
  import { multiplyIcon } from "$lib/client/icons";
</script>

<button class="button-shadow" on:click type="button" title="close">
  <Svg ds={multiplyIcon} dimension="30" />
</button>

<style>
  button {
    padding: 0;
    border-radius: 0;
    outline: none;
  }
</style>
