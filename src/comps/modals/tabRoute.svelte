<script>
  import { page } from "$app/stores";

  export let tab = "";

  /**@type {string[]}*/
  export let tabs = [];

  let { pathname } = $page.url;
</script>

<div class="tabs">
  {#each tabs as value}
    {@const disabled = value === tab}
    {@const href = disabled ? "#" : `${pathname}?tab=${value}`}

    <a {href} data-sveltekit-reload class:disabled class="button">
      {value}
    </a>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    flex-direction: row;
    gap: var(--gap-sm);
    flex-wrap: wrap;
  }

  .tabs a {
    padding: var(--gap-micro) var(--gap-base);
    font-size: 0.8rem;
    color: currentColor;
    background-color: transparent;
  }

  .tabs a:not(.disabled) {
    outline-color: var(--prim-color);
    color: var(--prim-color);
  }
</style>
