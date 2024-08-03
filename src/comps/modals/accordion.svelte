<script lang="ts">
  import { slide, scale } from "svelte/transition";
  import Svg from "./svg.svelte";
  import { chevronDownIcon, chevronRightIcon } from "$lib/client/icons";

  let accordion = { tag: "div", title: "", id: "", selected: "" };

  export let { tag, id, title, selected } = accordion;
  export let open = false;
  export let block = false;

  let select = () => {
    selected = selected === id ? "" : id;
  };
</script>

<div class="wrapper">
  <div class:checked={selected === id} class:open>
    <button type="button" on:click={select} class:block>
      {#if !open}
        <span class="title">{title}</span>

        <div class="icon">
          {#if selected === id}
            <span in:scale>
              <Svg ds={chevronDownIcon} />
            </span>
          {:else}
            <span in:scale>
              <Svg ds={chevronRightIcon} />
            </span>
          {/if}
        </div>
      {/if}
    </button>

    {#if selected === id || open}
      <svelte:element this={tag} transition:slide class="content">
        <slot />
      </svelte:element>
    {/if}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    justify-content: center;
    gap: var(--gap-md);
    width: 100%;
  }

  .wrapper > div {
    width: inherit;
    border-radius: var(--radius-sm);
    outline: var(--outline);
  }

  button {
    justify-content: space-between;
    color: currentColor;
    background-color: transparent;
    border-radius: 0;
    width: 100%;
    text-transform: capitalize;
    padding: 0 var(--gap-sml) !important;
    outline: none;
  }

  button.block {
    padding-block: var(--gap-base);
  }

  div.open button {
    padding: 0;
  }

  .checked button {
    border-bottom: var(--outline);
  }

  button:active {
    transform: none;
  }

  .content {
    padding: var(--gap-sm);
  }

  .open button ~ .content {
    padding-block: var(--gap-base);
  }

  .icon {
    border-left: var(--outline);
    padding: var(--gap-sml) 0;
    padding-left: var(--gap-sml);
  }
</style>
