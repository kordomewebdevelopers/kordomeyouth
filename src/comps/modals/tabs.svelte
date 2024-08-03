<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { tabbed } from "$store/page";
  import { queryParam, ssp } from "sveltekit-search-params";

  /**
   * @type {string[]}
   */
  export let tabs = [];
  export let upper = false;

  $: param = queryParam("tab", ssp.string(), { pushHistory: false });
  $: $tabbed = tabs.find((t) => t === $param) || tabs[0];
  $: curr = tabs.findIndex((t) => t === $tabbed);

  let { length } = tabs;
  let move = tweened(0, { duration: 300, easing: cubicOut });

  $: move.set(curr * 100);

  /**
   * @param {Object} data
   * @param {string} data.tab
   * @param {number} data.index
   */
  const step = (data) => {
    curr = data.index;
    $tabbed = data.tab;
    $param = data.tab;
  };
</script>

<div class:small={length > 2} class:upper>
  <span
    style="width: {100 / length}%; transform: translateX({$move}%); "
    class:first={curr === 0}
    class:last={curr === length - 1}
  />
  {#each tabs as tab, index}
    {@const active = curr === index}

    <button on:click={() => step({ index, tab })} class:active type="button">
      {tab}
    </button>
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    outline: var(--outline);
    border-radius: var(--radius-sm);
    position: relative;
    width: 100%;
  }

  span {
    position: absolute;
    height: 100%;
    color: var(--dark-heading);
    background-color: var(--sec-color);
    z-index: 0;
    overflow: hidden;
  }

  button {
    flex: 1;
    background-color: transparent;
    color: currentColor;
    outline: none;
    border-radius: 0;
    z-index: 1;
    transition: none;
  }

  div.small button {
    text-transform: lowercase;
    font-size: 0.9rem;
    padding: var(--gap-base);
  }

  div.small.upper button {
    text-transform: uppercase;
  }

  .first {
    border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  }

  .last {
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  }

  button.active {
    color: var(--dark-heading);
    transition: none;
  }
</style>
