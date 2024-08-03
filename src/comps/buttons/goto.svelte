<script>
  import Svg from "$comps/modals/svg.svelte";
  import { arrowLeftIcon, arrowRightIcon } from "$lib/client/icons";

  export let href = "";
  export let title = "";
  export let right = false;
</script>

<a {href} class="button-sec">
  {#if right}
    <Svg ds={arrowLeftIcon} dimension="23" />
  {/if}
  <span>{title}</span>
  {#if !right}
    <Svg ds={arrowRightIcon} dimension="23" />
  {/if}
</a>

<style>
  a {
    padding: var(--gap-micro) var(--gap-base);
    border-radius: 5rem;
    gap: var(--gap-sml);
    font-size: 0.8rem;
    background-color: var(--sec-color);
    color: var(--dark-shade);
    border: 0.05rem solid currentColor;
    outline: none;
  }
</style>
