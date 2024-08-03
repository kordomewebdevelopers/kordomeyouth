<script>
  import Callout from "$comps/modals/callout.svelte";

  export let button = false;

  let href = "/dash/settings?open=resend&title=Resend emial verification";
</script>

<Callout info>
  You need to verify your email.
  {#if button}
    <button on:click>Resend verification email</button>
  {:else}
    <a {href}>Resend verification email</a>
  {/if}
  or kindly check your inbox.
</Callout>

<style>
  button {
    display: inline;
    padding: 0;
    text-transform: initial;
    color: currentColor;
    background-color: transparent;
    outline: none;
    text-decoration: underline;
  }
</style>
