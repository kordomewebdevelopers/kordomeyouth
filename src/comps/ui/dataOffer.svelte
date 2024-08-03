<script lang="ts">
  import { enhance } from "$app/forms";
  import Selector from "$comps/form/selector.svelte";
  import Slider from "$comps/modals/slider.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import { dataPacks } from "$lib/data/dataPacks";
  import type { DataOfferID } from "$types/defs";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { scale } from "svelte/transition";

  export let submit: SubmitFunction = () => {};
  export let id: DataOfferID = "mtn_data";
  export let title = "";
  export let network = "";
  export let wallet = 0;
  export let loading = false;

  let dataOffers = id !== "mtn_evd" ? dataPacks[id] : undefined;
  let packs = dataOffers && dataOffers.map((offer) => offer.pack);
  let selected = dataOffers ? dataOffers[0] : { amount: 0, pack: "evd" };

  $: balance = parseFloat((wallet - selected.amount).toFixed(5));
  $: disabled = selected.amount < 1;

  const pick = (item: string) => {
    if (!dataOffers) return;
    selected = dataOffers.find((bundle) => bundle.pack === item) || selected;
  };
</script>

<Slider {title} on:click>
  <form method="POST" action="?/buy_data" use:enhance={submit}>
    <div>
      <label for="receiver">Enter receiver number </label>
      <input type="tel" name="receiver" id="receiver" />
    </div>

    {#if packs}
      <div>
        <Selector items={packs} open on:pick={(e) => pick(e.detail)} />
        {#key selected.amount}
          <div class="pack">
            <span>WALLET: <span>GHC {wallet}</span></span>
            <span in:scale>SPEND: <span>GHC {selected.amount}</span></span>
            <span in:scale>
              BALANCE:
              <span class:out={balance < 0}>GHC {balance}</span>
            </span>
          </div>
        {/key}
      </div>
    {:else}
      <div>
        <label for="amount">Enter amount (GHC)</label>
        <input type="tel" bind:value={selected.amount} />

        <div class="pack">
          <span>WALLET: <span>GHC {wallet}</span></span>

          <span in:scale>
            BALANCE:
            <span class:out={balance < 0}>GHC {balance}</span>
          </span>
        </div>
      </div>
    {/if}

    <input type="hidden" name="amount" value={selected.amount} />
    <input type="hidden" name="pack" value={selected.pack} />
    <input type="hidden" name="network" value={network} />

    <div class="flow-wide">
      {#if balance < 0}
        <a href="/dash/top-up" class="button" in:scale>top up</a>
      {:else}
        <button in:scale {disabled}>
          <Spinner {loading} />
          <span>make order</span>
        </button>
      {/if}
    </div>
  </form>
</Slider>

<style>
  form {
    padding: 2rem 1rem 1rem;
    gap: var(--gap-sm);
  }

  .pack {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-base);
    justify-content: space-between;
  }

  .pack > span {
    outline: var(--outline);
    padding: var(--gap-sml) 0.9rem;
    border-radius: var(--radius-sm);
  }

  .pack > span > span {
    color: var(--prim-color);
    margin-left: var(--gap-micro);
  }

  .pack > span > span.out {
    color: var(--red-200);
  }

  .flow-wide {
    margin-top: 1rem;
  }

  button,
  .button {
    width: 100%;
  }

  .button {
    background-color: var(--sec-color);
  }
</style>
