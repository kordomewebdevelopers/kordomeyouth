<script>
  import { page } from "$app/stores";
  import Nav from "$comps/navs/nav.svelte";
  import Logo from "./logo.svelte";
  import { fly } from "svelte/transition";
  import Menu from "$comps/buttons/menu.svelte";

  let toggle = "auto";
</script>

{#key $page.url.pathname}
  <header in:fly={{ y: 30 }}>
    <a href="/">
      <Logo size="28" />
      <span class="title">kordome youths</span>
    </a>

    <Menu on:click={() => (toggle = "nav")} />
  </header>
{/key}

{#if toggle === "nav"}
  <Nav on:click={() => (toggle = "auto")} />
{/if}

<style>
  header {
    background-color: var(--bg-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--gap-base) var(--gap-sm);
    z-index: 500;
    view-transition-name: header;
    box-shadow: var(--shadow-inset);
  }

  a {
    font-size: 1.5rem;
    display: flex;
    gap: var(--gap-micro);
    align-items: center;
  }

  .title {
    color: var(--heading-color);
    font-size: 1.5rem;
    font-weight: bolder;
    text-transform: uppercase;
  }
</style>
