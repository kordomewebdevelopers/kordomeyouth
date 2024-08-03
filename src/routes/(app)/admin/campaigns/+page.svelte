<script lang="ts">
  import Accordion from "$comps/modals/accordion.svelte";
  import Slider from "$comps/modals/slider.svelte";
  import { applyAction, enhance } from "$app/forms";
  import Spinner from "$comps/modals/spinner.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-french-toast";
  import Hero from "$comps/modals/hero.svelte";
  import { copyText, formatDate } from "$helpers/formats";
  import { deleteFromFB } from "$lib/client/firebase/storage";
  import Menu from "$comps/buttons/menu.svelte";
  import Callout from "$comps/modals/callout.svelte";
  import TabRoute from "$comps/modals/tabRoute.svelte";

  export let data;
  export let form;

  let { campaigns, tab } = data;
  let tabs = ["pending", "ended", "rejected", "completed"];
  let loading = false;
  let campaign = { id: "", status: "", file: "" };
  let regulate = "running";

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message, { duration: 5000 });
      }

      if (form?.state === "success") {
        toast.success(form.message, { duration: 5000 });
      }

      if (form?.deletedId) {
        const { deletedId } = form;
        await deleteFromFB(deletedId, "campaigns");
        campaigns = campaigns.filter((c) => c.id !== form?.deletedId);
      }

      if (form?.campaignId) {
        const { campaignId: id } = form;

        campaigns = campaigns.filter((c) => c.id !== id);
      }

      loading = false;
      campaign.id = "";
    };
  };

  const copyData = async (data: string | number) => {
    await copyText(`${data}`);

    toast.success("Successfully copied");
  };
</script>

<section>
  <div>
    <h3>{tab} campaigns</h3>

    <TabRoute {tab} {tabs} />
  </div>

  {#each campaigns as { views, format, file, id, created_at, max, status, link, budget, transact_id }}
    <div class="accord">
      <div class="inner">
        <div>{status}</div>

        <div>{format}</div>

        <Menu
          on:click={() => (campaign = { id, status, file })}
          dimension="18"
        />
      </div>

      <Accordion {id} block>
        <div class="wrap">
          <span>ID</span>
          <span>{id}</span>
        </div>

        <div class="wrap">
          <span>Max / Views</span>
          <span>{max} / {views}</span>
        </div>

        <div class="wrap">
          <span>Budget</span>
          <span>GHC {budget}</span>
        </div>

        {#if link}
          <div class="wrap">
            <span>Link</span>
            <a href={link}>
              {link.slice(0, 38)}
            </a>
          </div>
        {/if}

        <div class="wrap">
          <span>Transaction</span>
          <button on:click={() => copyData(transact_id)}>
            {transact_id || "#none"}
          </button>
        </div>

        <div class="wrap">
          <span>Created at</span>
          <span>{formatDate(created_at)}</span>
        </div>
      </Accordion>
    </div>
  {:else}
    <div class="nothing">
      <Hero size="15" />
      <div class="info">Everything is quiet here. No activity made.</div>
    </div>
  {/each}
</section>

{#if campaign.id}
  {@const { status, file, id } = campaign}
  <Slider on:click={() => (campaign.id = "")} title={id}>
    <form method="POST" use:enhance={submit}>
      <input type="hidden" name="campaignId" value={id} />

      {#if status === "pending"}
        <img src={file} alt="campaign" />

        <input type="hidden" name="status" value={regulate} />

        <div class="flow-wide">
          <button
            formaction="?/regulate"
            class="button-shadow"
            on:click={() => (regulate = "rejected")}
          >
            {#if regulate === "rejected"}
              <Spinner {loading} />
            {/if}
            <span>reject</span>
          </button>

          <button
            formaction="?/regulate"
            on:click={() => (regulate = "approved")}
          >
            {#if regulate === "approved"}
              <Spinner {loading} />
            {/if}
            <span>approve</span>
          </button>
        </div>
      {/if}

      {#if status === "running"}
        <Callout>This campaign is due, submit to end it.</Callout>

        <input type="hidden" name="status" value="ended" />

        <div class="flow-wide">
          <button formaction="?/regulate">
            <Spinner {loading} />
            <span>submit</span>
          </button>
        </div>
      {/if}

      {#if status === "ended" || status === "rejected"}
        <Callout>You can safely remove this campaign.</Callout>

        <div class="flow-wide">
          <button formaction="?/remove">
            <Spinner {loading} />
            <span>remove</span>
          </button>
        </div>
      {/if}
    </form>
  </Slider>
{/if}

<style>
  h3 {
    text-transform: capitalize;
  }

  form {
    padding: 2rem 1rem;
  }

  .accord .inner > * {
    font-size: 1rem;
  }

  .accord .wrap > span:first-child {
    color: var(--sec-color);
  }

  .accord .wrap button {
    padding: 0;
    border-radius: 0;
    color: currentColor;
    background-color: transparent;
    outline: none;
    text-decoration: underline;
    text-transform: lowercase;
  }

  form button {
    width: 100%;
  }

  form img {
    width: 18rem;
    margin: 0 auto;
    border-radius: var(--radius-sm);
  }
</style>
