<script>
  import { theme } from "$store/theme";

  export let full = false;
  export let classes = "normal";
  export let up = false;
</script>

<main class="{classes} {$theme}" class:up class:full>
  <slot />
</main>

<style>
  main {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    padding-inline: var(--gap-sm);
    padding-block: 2rem 5rem;
  }

  main.full {
    padding-inline: 0;
  }

  main.up {
    padding-bottom: 10rem;
  }
</style>
