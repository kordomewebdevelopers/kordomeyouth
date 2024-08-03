<script lang="ts">
  import Close from "$comps/buttons/close.svelte";
  import { fade, slide } from "svelte/transition";

  export let title = "";
  export let tag = "div";
  export let top = false;
  export let bottom = "0";
</script>

<div tabindex="0" role="button" on:keyup on:click|self transition:fade>
  <div style:bottom class="wrapper" class:top transition:slide>
    {#if title}
      <div title="head">
        <h1>{title}</h1>

        <span><Close on:click /></span>
      </div>
    {/if}

    <svelte:element this={tag} class="content">
      <slot />
    </svelte:element>
  </div>
</div>

<style>
  div[role="button"] {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    border-radius: 0;
    margin: 0;
    border: none;
    background-color: hsla(173, 29%, 30%, 0.5);
    backdrop-filter: blur(2px);
    z-index: 600;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    color: inherit;
    position: fixed;
    right: 0;
    left: 0;
    overflow-y: scroll;
    background-color: var(--bg-color);
    border-radius: 1rem 1rem 0 0;

    & [title="head"] {
      padding: var(--gap-base) var(--gap-sm);
      font-size: 1.3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      outline: var(--outline);
      position: sticky;
      top: 0;
      background-color: inherit;

      & h1 {
        font-size: inherit;
        margin: 0;
      }

      & span {
        margin: 0;
      }
    }
  }

  .wrapper.top {
    top: 0;
  }

  @media (min-width: 50em) {
    .wrapper {
      left: 50%;
      transform: translateX(-50%);
      width: 40rem;
    }
  }
</style>
