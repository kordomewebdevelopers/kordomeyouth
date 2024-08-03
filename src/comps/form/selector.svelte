<script lang="ts">
  import Accordion from "$comps/modals/accordion.svelte";
  import { createEventDispatcher } from "svelte";

  export let items: string[] = [];
  export let select = "";
  export let open = false;
  export let type: "button" | "submit" | "reset" = "button";
  export let title = "";

  $: selected = select || items[0];

  let dispatch = createEventDispatcher();

  let id = "select";

  const pick = (item: string) => {
    dispatch("pick", item);

    selected = item;

    id = `${Math.random() * 1000}`;
  };
</script>

<Accordion title={title || selected} {id} {open}>
  <div>
    <ul>
      {#each items as item}
        <li class:selected={selected === item}>
          <button {type} value={item} on:click={() => pick(item)}>
            {item}
          </button>
        </li>
      {/each}
    </ul>
  </div>
</Accordion>

<style>
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-base);
    justify-content: space-between;
  }

  ul li button {
    padding: 0;
    margin: 0;
    color: currentColor;
    background-color: transparent;
    font-weight: normal !important;
    outline: none;
    text-transform: capitalize;
  }

  ul li.selected button {
    font-weight: bolder !important;
    color: var(--prim-color);
  }
</style>
