<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import Svg from "$comps/modals/svg.svelte";
  import { arrowLeftIcon } from "$lib/client/icons";

  export let dimension = "35";

  let href = "/";

  afterNavigate(({ from }) => {
    href = from?.url.pathname || "/";
  });
</script>

<a {href} class="button-shadow">
  <Svg ds={arrowLeftIcon} title="Return back" {dimension} />
</a>

<style>
  a {
    color: currentColor !important;
    padding: 0;
    outline: none;
  }
</style>
