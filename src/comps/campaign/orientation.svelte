<script lang="ts">
  import { campaign } from "$store/campaign";

  import { createEventDispatcher } from "svelte";

  export let selected = 1 / 1;

  let dispatch = createEventDispatcher();

  const change = (value: number) => {
    selected = value;

    $campaign.file = "";

    dispatch("check", selected);
  };
</script>

<div class="orient">
  <div class="radio">
    <label for="square">1/1</label>
    <input
      checked={selected === 1 / 1}
      type="radio"
      name="story"
      id="square"
      on:change={() => change(1 / 1)}
    />
  </div>

  <div class="radio">
    <label for="flat">4/3</label>
    <input
      checked={selected === 4 / 3}
      type="radio"
      name="story"
      id="flat"
      on:change={() => change(4 / 3)}
    />
  </div>
</div>

<style>
  .orient {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-sm);
    margin-top: var(--gap-base);
    justify-content: space-between;
  }

  .radio {
    outline: var(--outline);
    padding: 0.3rem var(--gap-sml);
    border-radius: var(--radius-sm);
  }
</style>
