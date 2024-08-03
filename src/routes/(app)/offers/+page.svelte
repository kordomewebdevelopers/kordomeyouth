<script lang="ts">
  import { applyAction } from "$app/forms";
  import Goto from "$comps/buttons/goto.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import Offer from "$comps/ui/dataOffer.svelte";
  import { lockIcon } from "$lib/client/icons";
  import { data_offers } from "$lib/data/offers";
  import type { DataOfferID } from "$types/defs";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-french-toast";

  type Offer = { id: DataOfferID; title: string; network: string };

  export let data;
  export let form;

  let { wallet } = data;
  let offer: Offer = { id: "at_data", title: "", network: "" };
  let loading = false;

  const submit: SubmitFunction = () => {
    loading = true;

    return async ({ result }) => {
      loading = false;

      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message, { duration: 5000 });
      }

      if (form?.state.includes("success")) {
        toast.success(form.message, { duration: 5000 });
        wallet = form.balance || wallet;
        offer.title = "";
      }
    };
  };
</script>

<section class="vertical">
  <h3>
    <span>Data offers</span>
    <Goto href="/orders" title="orders" />
  </h3>

  <ul class="cards">
    {#each data_offers as { title, thumbnail, id, disabled, network, desc }}
      <li>
        <button on:click={() => (offer = { id, network, title })}>
          <img src={thumbnail} alt={title} />

          <div>
            <div>
              <span class="heading">
                <span>{title}</span>
                {#if disabled}
                  <Svg ds={lockIcon} dimension="18" />
                {/if}
              </span>
              <p>{desc}</p>
            </div>
          </div>
        </button>
      </li>
    {/each}
  </ul>
</section>

{#if offer.title}
  {@const { id, network, title } = offer}
  <Offer
    {id}
    {network}
    {title}
    on:click={() => (offer.title = "")}
    {wallet}
    {submit}
    {loading}
  />
{/if}

<style>
  h3 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .heading {
    display: flex;
    align-items: center;
    gap: var(--gap-smallest);
    margin-bottom: var(--gap-micro);
  }
</style>
