<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import Accordion from "$comps/modals/accordion.svelte";
  import Slider from "$comps/modals/slider.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import { plusIcon } from "$lib/client/icons";
  import { eyeIcon } from "$lib/client/icons";
  import { abbrevNum } from "$helpers/number";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-french-toast";
  import { formatDate } from "$helpers/formats";
  import { getCampaignInfo } from "$helpers/infos";
  import { deleteFromFB } from "$lib/client/firebase/storage";
  import Callout from "$comps/modals/callout.svelte";
  import Empty from "$comps/modals/empty.svelte";
  import Menu from "$comps/buttons/menu.svelte";

  export let data;
  export let form;

  let { campaigns } = data;
  let loading = false;

  let campaign = {
    format: "",
    status: "",
    id: "",
    budget: 0,
    submissions: 0,
    href: "",
  };

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message);
      }

      if (form?.state === "success") {
        toast.success(form.message);
      }

      if (form?.campaign) {
        const { campaign } = form;

        campaigns = campaigns.map((c) => {
          return c.id === campaign.id ? campaign : c;
        });
      }

      if (form?.removedId) {
        const { removedId } = form;
        await deleteFromFB(removedId, "campaigns");
        campaigns = campaigns.filter((c) => c.id !== removedId);
      }

      loading = false;
      campaign.id = "";
    };
  };
</script>

<section>
  <div class="flow-wide">
    <h3>Campaigns</h3>

    <a href="/create/campaign" class="button create">
      <span>create</span>
      <Svg ds={plusIcon} dimension="20" />
    </a>
  </div>

  {#each campaigns as { format, id, created_at, max, status, views, clicks, label, link, promotions, budget, transact_id, submissions }}
    {@const href = `/studio/campaigns/${id}`}
    <div class="accord">
      <div class="inner">
        <div>
          <Svg ds={eyeIcon} dimension="20" />
          <span>{abbrevNum(views)}</span>
        </div>

        <span class="status {status}" />

        {#if submissions > 0}
          <a {href}>check</a>
        {:else}
          <button class="stats">stats</button>
        {/if}

        <Menu
          dimension="20"
          on:click={() => {
            campaign = { id, format, status, budget, submissions, href };
          }}
        />
      </div>

      <Accordion {id} block>
        <div class="wrap">
          <div>
            <span>ID</span>
            <span>{id}</span>
          </div>
        </div>

        <div class="wrap">
          <div>
            <span>Status</span>
            <span class="status {status}">{status}</span>
          </div>

          <div>
            <span>Clicks</span>
            <span>{clicks}</span>
          </div>
        </div>

        <div class="wrap">
          <div>
            <span>Maximum </span>
            <span>{max}</span>
          </div>

          <div>
            <span>Views</span>
            <span>{views}</span>
          </div>
        </div>

        <div class="wrap">
          <div>
            <span>Promotions</span>
            <span>{promotions}</span>
          </div>

          <div>
            <span>Format</span>
            <span>{format}</span>
          </div>
        </div>

        <div class="wrap">
          <div>
            <span>Budget</span>
            <span>GHC {budget}</span>
          </div>

          <div>
            <span>Transaction</span>
            <span>{transact_id || "none"}</span>
          </div>
        </div>

        <div class="wrap">
          <div>
            <span>Link</span>
            <span>{link.slice(0, 38) || "none"}</span>
          </div>

          <div>
            <span>Label</span>
            <span>{label}</span>
          </div>
        </div>

        <div class="wrap">
          <div>
            <span>Created at</span>
            <span>{formatDate(created_at)}</span>
          </div>
        </div>

        <div class="wrap info">
          {getCampaignInfo(status)}
        </div>
      </Accordion>
    </div>
  {:else}
    <Empty info>
      All clear, you have no campaign ad running at the moment.
      <a href="/create/campaign">Create a campaign</a>.
    </Empty>
  {/each}
</section>

{#if campaign.id}
  {@const { format, status, id, budget, submissions, href } = campaign}
  <Slider on:click={() => (campaign.id = "")} title="Campaign Actions">
    <form method="POST" use:enhance={submit}>
      <input type="hidden" name="campaignId" value={id} />
      <input type="hidden" name="format" value={format} />

      <Callout info>
        {@html getCampaignInfo(status)}
      </Callout>

      {#if status === "running"}
        <input type="hidden" name="status" value="paused" />

        <div class="flow-wide">
          <button formaction="?/regulate">
            <Spinner {loading} />
            <span>pause</span>
          </button>

          {#if submissions > 0}
            <a {href} class="button-sec">check promotions</a>
          {/if}
        </div>
      {/if}

      {#if status === "ended" || status === "rejected"}
        <button formaction="?/remove">
          <Spinner {loading} />
          <span>remove campaign</span>
        </button>
      {/if}

      {#if status === "approved"}
        {@const href = `/dash/pay-campaign-${budget}-${id}?coupon=demo`}
        <a {href} class="button">go to payment</a>
      {/if}

      {#if status === "paused"}
        <input type="hidden" name="status" value="running" />

        <button formaction="?/regulate">
          <Spinner {loading} />
          <span>revive campaign</span>
        </button>
      {/if}
    </form>
  </Slider>
{/if}

<style>
  a.create {
    padding: var(--gap-sml) var(--gap-base);
    gap: var(--gap-sml);
    border-radius: var(--radius-lg);
  }

  .status {
    padding: var(--gap-micro);
    background-color: currentColor;
    border-radius: 50%;
    color: currentColor;
  }

  .status.paused {
    background-color: var(--warn-color);
  }

  .status.running {
    background-color: currentColor;
    animation: heartbeat 0.8s ease infinite;
  }

  .status.rejected {
    background-color: var(--red-200);
  }

  .status.ended {
    background-color: var(--red-100);
  }

  .status.approved {
    background-color: var(--prim-color);
  }

  .wrap {
    & .status {
      padding: 0;
      color: currentColor;
      border-radius: 0;
      text-transform: uppercase;
      background-color: transparent;
    }

    & .status.paused {
      color: var(--warn-color);
    }

    & .status.running {
      color: currentColor;
      animation: none;
    }

    & .status.rejected {
      color: var(--red-200);
    }

    & .status.ended {
      color: var(--red-100);
    }

    & .status.approved {
      color: var(--prim-color);
    }
  }

  form {
    padding: 3rem 1rem;

    & button {
      width: 100%;
    }
  }

  .stats {
    padding: 0;
    text-transform: lowercase;
    background-color: transparent;
    color: var(--sec-color);
    border-radius: 0;
    outline: none;
  }
</style>
