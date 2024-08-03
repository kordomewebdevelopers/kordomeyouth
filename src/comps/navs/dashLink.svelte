<script>
  import Svg from "$comps/modals/svg.svelte";
  import { arrowRightIcon, lockIcon } from "$lib/client/icons";

  /**@typedef {import('$types/defs').DashLinkTypes} DashLink */

  /**@type {DashLink[]}*/
  export let links = [];
</script>

<div class="wrapper">
  {#each links as { link, title, disabled, info }}
    {@const href = disabled ? "#" : link}
    {@const ds = disabled ? lockIcon : arrowRightIcon}
    {@const dimension = disabled ? "25" : "30"}
    {@const classed = disabled ? "noon" : "button-shadow"}
    <a {href} class={classed}>
      <span>{title}</span>

      <div>
        {#if info}
          <span class="info {info}">{info}</span>
        {/if}

        <span class="lock">
          <Svg {ds} {dimension} />
        </span>
      </div>
    </a>
  {/each}
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  a {
    display: flex;
    justify-content: space-between;
    color: currentColor;
    outline: var(--outline);
    padding: var(--gap-sml) var(--gap-base);
    align-items: center;
    border-radius: var(--radius-sm);
    text-transform: uppercase;
  }

  a > div {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
  }

  .info {
    box-shadow: var(--shadow-inset);
    padding: var(--gap-nano) var(--gap-base);
    border-radius: var(--radius-sm);
    text-transform: lowercase;
  }

  .info.new {
    color: var(--prim-color);
  }

  .info.soon {
    color: var(--sec-color);
  }
</style>
