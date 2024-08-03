<script>
  import Svg from "$comps/modals/svg.svelte";
  import { chevronRightIcon } from "$lib/client/icons";
  import { dangerIcon, successIcon } from "$lib/client/icons";

  export let value = "";
  export let verified = false;
  export let cap = false;
</script>

<button on:click>
  <span class:cap>{@html value}</span>

  <div class="icons">
    {#if value.includes("@")}
      {@const ds = verified ? successIcon : dangerIcon}
      <span class:verified class="icon">
        <Svg {ds} dimension="20" />
      </span>
    {/if}

    <Svg ds={chevronRightIcon} />
  </div>
</button>

<style>
  button {
    justify-content: space-between;
    background-color: transparent;
    color: currentColor;
    text-transform: initial;
    padding-inline: var(--gap-base) var(--gap-micro);
  }

  .cap {
    text-transform: uppercase;
  }

  .icons {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);

    & span {
      color: var(--red-200);
    }

    & span.verified {
      color: var(--prim-color);
    }
  }
</style>
