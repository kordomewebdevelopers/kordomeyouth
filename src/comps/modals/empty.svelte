<script>
  import { page } from "$app/stores";
  import Callout from "./callout.svelte";
  import Hero from "./hero.svelte";

  export let warn = false;
  export let info = false;
</script>

<div>
  <Hero size="15" />
  <Callout {warn} {info}>
    <slot />
    {#if !$page.data.authUser}
      <a href="/auth/signin">Signin to your account.</a>
    {/if}
  </Callout>
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--gap-base);
  }

  a {
    text-decoration: underline;
  }
</style>
