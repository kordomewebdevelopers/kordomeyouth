<script lang="ts">
  import Slider from "$comps/modals/slider.svelte";
  import { applyAction, enhance } from "$app/forms";
  import Spinner from "$comps/modals/spinner.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-french-toast";
  import Accordion from "$comps/modals/accordion.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import { eyeIcon } from "$lib/client/icons";
  import { abbrevNum } from "$helpers/number";
  import { formatDate, getHoursBy } from "$helpers/formats";
  import { getTomorrow } from "$helpers/formats";
  import Screenshot from "$comps/ui/screenshot.svelte";
  import { fetcher } from "$helpers/fetcher";
  import { uploadToFB } from "$lib/client/firebase/storage";
  import { deleteFromFB } from "$lib/client/firebase/storage";
  import Empty from "$comps/modals/empty.svelte";
  import Goto from "$comps/buttons/goto.svelte";
  import Callout from "$comps/modals/callout.svelte";
  import Menu from "$comps/buttons/menu.svelte";
  import { getPromotionInfo } from "$helpers/infos";

  export let data;
  export let form;

  let { promotions, user } = data;

  let promotion = {
    id: "",
    status: "",
    earn: 0,
    campaign_id: "",
    campaign_file: "",
    tomorrow: 0,
  };

  let loading = false;
  let file = "";
  let metadata = {};
  let view = "";
  let buttonId = "auto";
  const folder = "promotions";

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

        if (form.action !== "expired") {
          await deleteFromFB(deletedId, folder);
        }

        promotions = promotions.filter((p) => p.id !== deletedId);
      }

      if (form?.state === "feedback") {
        if (!file.length) {
          toast.error("Kindly, upload the screenshot");
          loading = false;
          return;
        }

        if (!view) {
          toast.error("Kindly, enter number of views");
          loading = false;
          return;
        }

        const { id, campaign_id } = promotion;

        const result = await uploadToFB(file, folder, id);

        if (result.status === "error") {
          toast.error("Error uploading image file");
          loading = false;
          return;
        }

        const response = await fetcher("?/feedback", "POST", {
          file: result.url,
          id,
          views: view,
          campaign_id,
          metadata,
        });

        const res = await response.json();

        if (res.type === "success") {
          const status = "submitted";
          file = result.url;
          const views = parseInt(view);

          promotions = promotions.map((p) => {
            return p.id === id ? { ...p, status, file, views } : p;
          });

          toast.success("Submitted successfully");
        } else {
          toast.error("An error occurred. Try again");
        }
      }

      loading = false;
      view = "";
      file = "";
      promotion.id = "";
    };
  };

  const promotionStatus = (status: string, date: number) => {
    date = getTomorrow(date);
    const tomorrow = getHoursBy(date, "minus", 1);

    if (tomorrow - Date.now() <= 0 && status === "running") {
      return { tomorrow, state: "expired" };
    }

    return { tomorrow, state: status };
  };

  const countdown = (tomorrow = 0) => {
    const date = new Date(tomorrow - Date.now());
    let expires = date.getHours();
    let holder = "hours";

    if (expires <= 0) {
      expires = date.getMinutes();
      holder = "minutes";
    }

    return `Expires in ${expires} ${holder} time.
    Remember to take a screenshot few minutes to expiration`;
  };
</script>

<section>
  <div>
    <h4>
      <span>Promotions</span>
      <Goto
        href="/explore/campaigns?len={promotions.length}"
        title="campaigns"
      />
    </h4>

    <p>You can promote 10 campaigns in 24hrs.</p>
  </div>

  {#each promotions as { id, views, earn, created_at, status, campaign_id, campaign_file }}
    {@const date = Date.parse(`${created_at}`)}
    {@const { state, tomorrow } = promotionStatus(status, date)}
    <div class="accord">
      <div class="inner">
        <div>
          <span>{abbrevNum(views)}</span>
          <Svg ds={eyeIcon} dimension="20" />
        </div>

        <div>
          <span>GHC {earn}</span>
        </div>

        <span class="status {state}" />

        <Menu
          dimension="15"
          on:click={() => {
            promotion = {
              id,
              status: state,
              earn,
              campaign_id,
              campaign_file,
              tomorrow,
            };
          }}
        />
      </div>

      <Accordion {id} block>
        <div class="wrap">
          <span>ID</span>
          <span>{id}</span>
        </div>

        <div class="wrap">
          <span>Status</span>
          <span class="status {state}">{state}</span>
        </div>

        <div class="wrap">
          <span>Promoted at</span>
          <span>{formatDate(date)}</span>
        </div>

        <div class="wrap">
          <span>Expires at</span>
          <span>{formatDate(tomorrow)}</span>
        </div>

        <div class="wrap info">
          {getPromotionInfo(state, earn, countdown(tomorrow))}
        </div>
      </Accordion>
    </div>
  {:else}
    <Empty>All clear, you have no promotion running at the moment.</Empty>
  {/each}
</section>

{#if promotion.id}
  {@const { id, status, earn, campaign_file, tomorrow } = promotion}

  <Slider title="Promotion ( {id} )" on:click={() => (promotion.id = "")}>
    <form method="POST" use:enhance={submit} enctype="multipart/form-data">
      <input type="hidden" name="promotionId" value={id} />
      <input type="hidden" name="earn" value={earn} />

      {#if status !== "expired"}
        <Callout>
          {getPromotionInfo(status, earn, countdown(tomorrow))}
        </Callout>
      {/if}

      {#if status === "rejected"}
        {@const body = encodeURIComponent(`My promotion (${id}) was rejected.`)}

        <input type="hidden" name="action" value="removing" />

        <div class="flow-wide">
          <a
            href="https://wa.me/233557686338?text={body}"
            class="button-shadow"
          >
            report
          </a>

          <button formaction="?/remove">
            <Spinner {loading} />
            <span>remove</span>
          </button>
        </div>
      {/if}

      {#if status === "approved"}
        <input type="hidden" name="ref_id" value={user.ref_id} />

        <div class="flow-wide">
          <button formaction="?/reward" style="width: 100%;">
            <Spinner {loading} />
            <span>add to wallet</span>
          </button>
        </div>
      {/if}

      {#if status === "expired"}
        <Screenshot
          on:crop={(e) => (file = e.detail.file)}
          on:upload={(e) => (metadata = e.detail.metadata)}
          {id}
          {campaign_file}
        />

        <div>
          <label for="views">
            Enter the number of views in the screenshot.
          </label>
          <input type="tel" name="views" id="views" bind:value={view} />
        </div>

        <input type="hidden" name="action" value="expired" />

        <div class="flow-wide">
          <button
            formaction="?/remove"
            class="button-sec"
            on:click={() => (buttonId = "delete")}
          >
            {#if buttonId === "delete"}
              <Spinner {loading} />
            {/if}
            <span>not available</span>
          </button>

          <button formaction="?/submit" on:click={() => (buttonId = "submit")}>
            {#if buttonId === "submit"}
              <Spinner {loading} />
            {/if}
            <span>submit</span>
          </button>
        </div>
      {/if}
    </form>
  </Slider>
{/if}

<style>
  h4 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-sm);
  }

  form {
    padding: 2rem 1rem;
    gap: 2rem;
  }

  .status {
    padding: var(--gap-micro);
    background-color: var(--sec-color);
    border-radius: 50%;
  }

  .status.submitted,
  .status.accepted {
    background-color: currentColor;
  }

  .status.running {
    background-color: var(--sec-color);
    animation: heartbeat 0.8s ease infinite;
  }

  .status.rejected {
    background-color: var(--red-200);
  }

  .status.approved {
    background-color: var(--prim-color);
  }

  .status.declined {
    background-color: var(--orange-200);
  }

  .wrap span:first-child {
    text-transform: uppercase;
  }

  .wrap {
    & .status {
      padding: 0;
      color: var(--sec-color);
      border-radius: 0;
      text-transform: uppercase;
      background-color: transparent;
    }

    & .status.submitted,
    .status.accepted {
      color: currentColor;
    }

    & .status.running {
      color: var(--sec-color);
      animation: none;
    }

    & .status.rejected {
      color: var(--red-200);
    }

    & .status.approved {
      color: var(--prim-color);
    }

    & .status.status.declined {
      color: var(--orange-200);
    }
  }

  form .flow-wide button,
  .flow-wide a {
    width: 100%;
  }
</style>
