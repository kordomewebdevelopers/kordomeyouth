<script>
  import Svg from "$comps/modals/svg.svelte";
  import { homeIcon } from "$lib/client/icons";

  export let dimension = "30";
  export let filled = false;
  export let href = "/";
</script>

<a {href} class="button-shadow">
  <Svg ds={homeIcon} {dimension} {filled} />
</a>

<style>
  a {
    color: currentColor;
    padding: 0;
    outline: none;
  }
</style>
