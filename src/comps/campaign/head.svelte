<script lang="ts">
  import { enhance } from "$app/forms";
  import Return from "$comps/buttons/return.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import { fly } from "svelte/transition";
  import { campaign } from "$store/campaign";
  import type { SubmitFunction } from "@sveltejs/kit";
  import Down from "$comps/transitions/down.svelte";
  import { tabbed } from "$store/page";
  import { queryParam, ssp } from "sveltekit-search-params";

  export let submit: SubmitFunction = () => {};
  export let loading = false;

  $: param = queryParam("tab", ssp.number(1), { pushHistory: false });
  $: $tabbed = $param;

  const step = (step: number) => {
    $tabbed = step;
    $param = step;
  };

  const stringify = (num: number) => {
    return `${num}`.replaceAll(",", "");
  };
</script>

<Down>
  {#key $tabbed}
    <div in:fly={{ y: 30 }}>
      <form method="POST" use:enhance={submit} action="?/publish">
        <input type="hidden" name="format" value={$campaign.format} />
        <input type="hidden" name="label" value={$campaign.label} />
        <input type="hidden" name="link" value={$campaign.link} />
        <input type="hidden" name="campaignId" value={$campaign.id} />
        <input type="hidden" name="reach" value={$campaign.reach} />
        <input
          type="hidden"
          name="budget"
          value={stringify($campaign.budget)}
        />

        {#if $tabbed === 1}
          <Return />
        {:else}
          <div class="shadow">
            <button type="button" on:click={() => step(Number($tabbed) - 1)}>
              previous
            </button>
          </div>
        {/if}

        {#if $tabbed === 4}
          <button>
            <Spinner {loading} />
            <span>submit</span>
          </button>
        {:else}
          <button type="button" on:click={() => step(Number($tabbed) + 1)}>
            continue
          </button>
        {/if}
      </form>
    </div>
  {/key}
</Down>

<style>
  form {
    display: flex;
    flex-direction: row;
    background-color: var(--bg-color);
    align-items: center;
    view-transition-name: header;
    padding: var(--gap-base) var(--gap-sm);
    justify-content: space-between !important;
  }

  form button {
    width: 100%;
  }

  .shadow button {
    background-color: transparent;
    color: currentColor;
  }
</style>
