<script>
  import { page } from "$app/stores";
  import Home from "$comps/buttons/home.svelte";
  import Return from "$comps/buttons/return.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import Nav from "$comps/navs/nav.svelte";
  import Notification from "$comps/buttons/notification.svelte";
  import Down from "$comps/transitions/down.svelte";
  import { bellIcon } from "$lib/client/icons";
  import Logo from "./logo.svelte";
  import { fly } from "svelte/transition";
  import Menu from "$comps/buttons/menu.svelte";

  let toggle = "auto";

  $: pathname = $page.url.pathname;
  $: ({ authUser, isAdmin } = $page.data);
</script>

<Down>
  {#key pathname}
    <div class="wrapper" in:fly={{ y: 30 }}>
      {#if pathname !== "/"}
        <Return />
      {/if}

      {#if !authUser && pathname === "/"}
        <a href="/auth/signin?tab=login" class="button-sec">login</a>
      {:else}
        <a href="/">
          <Logo size="25" />
          <span class="title">khekheli</span>
        </a>
      {/if}

      {#if isAdmin}
        <Home href="/admin/dash" />
      {:else if authUser && !isAdmin}
        <button on:click={() => (toggle = "notice")} class="notice">
          <Svg ds={bellIcon} dimension="30" />
        </button>
      {:else if pathname === "/"}
        <a href="/auth/signin?tab=signup" class="button">create free account</a>
      {/if}

      {#if !isAdmin}
        <Menu on:click={() => (toggle = "nav")} />
      {/if}
    </div>
  {/key}
</Down>

{#if toggle === "nav"}
  <Nav on:click={() => (toggle = "auto")} />
{/if}

{#if toggle === "notice"}
  <Notification on:click={() => (toggle = "auto")} />
{/if}

<style>
  .wrapper {
    background-color: var(--bg-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--gap-base) var(--gap-sm);
    z-index: 500;
    view-transition-name: header;
  }

  a:not(a.button-sec, a.button) {
    font-size: 1.5rem;
    display: flex;
    gap: var(--gap-micro);
    align-items: center;
  }

  .title {
    color: var(--heading-color);
    font-size: 1.8rem;
    font-weight: bolder;
  }

  button {
    background-color: transparent;
    color: currentColor;
    padding: var(--gap-nano);
    border-radius: var(--radius-sm);
  }

  button.notice {
    outline: none;
    padding: 0;
  }

  a.button-sec,
  a.button {
    padding: 0.6rem var(--gap-sml);
  }
</style>
