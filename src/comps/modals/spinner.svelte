<script>
  import { Circle } from "svelte-loading-spinners";

  export let color = "CurrentColor";
  export let size = "25";
  export let loading = false;
</script>

{#if loading}
  <span>
    <Circle {color} {size} />
  </span>
{/if}

<style>
  span {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    color: var(--lite);
    width: 100%;
    height: 100%;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: inherit;
    transition: width 1s;
  }
</style>
