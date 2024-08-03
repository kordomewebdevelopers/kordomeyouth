<script>
  import { fly } from "svelte/transition";

  export let tag = "div";
  export let classes = "";
</script>

<svelte:element this={tag} class={classes} in:fly={{ x: -250 }}>
  <slot />
</svelte:element>
