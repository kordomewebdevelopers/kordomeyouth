<script>
  import Svg from "$comps/modals/svg.svelte";
  import { lockIcon } from "$lib/client/icons";
  import { dashLinks } from "$lib/client/links";
</script>

<div>
  <div class="wrapper">
    {#each dashLinks as { link, title, ds, disabled, info }}
      {@const href = disabled ? "#" : link}
      <a {href} class="button-shadow">
        <div>
          <span>
            <Svg {ds} dimension="35" />
          </span>
        </div>

        <div>
          <span class="title">{title}</span>
        </div>

        {#if info && !disabled}
          <div class="info {info}">{info}</div>
        {/if}

        {#if disabled}
          <span class="lock">
            <Svg ds={lockIcon} dimension="18" />
          </span>
        {/if}
      </a>
    {/each}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-md) var(--gap-sm);
    justify-content: space-between;
  }

  a {
    display: flex;
    flex-direction: column;
    color: currentColor;
    padding: var(--gap-md) 0.1rem;
    align-items: center;
    border-radius: var(--radius-sm);
    outline: var(--outline);
    text-transform: capitalize;
    gap: var(--gap-sml);
    position: relative;
    min-width: 6rem;
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  a > div {
    display: flex;
    align-items: center;
    gap: var(--gap-sml);
  }

  .title {
    color: var(--heading-color);
  }

  .lock {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
  }

  a .info {
    padding: 0;
    outline: none;
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    font-size: 0.8rem;
    background-color: transparent;
  }

  .info.hot {
    color: var(--bolt-color);
  }

  .info.new {
    color: var(--sec-color);
  }
</style>
