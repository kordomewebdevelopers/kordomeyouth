<script>
  let previousScrollPosition = 0;
  let down = false;

  const handleScroll = () => {
    let scrollPosition = window.scrollY;

    down = scrollPosition > previousScrollPosition;

    previousScrollPosition = scrollPosition;
  };
</script>

<svelte:window on:scroll={handleScroll} />

{#if !down}
  <div>
    <slot></slot>
  </div>
{/if}

<style>
  div {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    border-top: var(--outline);
    background-color: var(--bg-color);
    z-index: 500;
  }
</style>
