<script>
  export let filled = false;
  export let color = "currentColor";
  export let title = "";
  export let dimension = "28";
  export let ds = [""];
  export let stroke = 1.5;

  $: fill = !stroke || filled ? color : "none";
</script>

<div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {fill}
    width={dimension}
    height={dimension}
    viewBox="0 0 24 24"
    stroke-width={stroke}
    stroke="currentColor"
    class="w-6 h-6"
    aria-label={title}
  >
    {#each ds as d}
      <path {d} />
    {/each}
  </svg>
</div>

<style>
  div {
    display: flex;
    align-items: center;
    font-size: 0;
    margin: 0;
    padding: 0;
  }
</style>
