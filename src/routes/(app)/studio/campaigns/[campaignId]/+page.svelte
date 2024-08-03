<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import Menu from "$comps/buttons/menu.svelte";
  import Accordion from "$comps/modals/accordion.svelte";
  import Callout from "$comps/modals/callout.svelte";
  import Empty from "$comps/modals/empty.svelte";
  import Slider from "$comps/modals/slider.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import { abbrevNum } from "$helpers/number";
  import { eyeIcon } from "$lib/client/icons";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-french-toast";
  import { scale } from "svelte/transition";

  export let data;
  export let form;

  let { promotions, campaignId } = data;

  type CheckProp = "no" | "yes" | "auto";
  type CheckType = { id: CheckProp; view: CheckProp };

  let loading = false;
  let promotion = { id: "", file: "", views: 0 };
  let newView = "";
  let check: CheckType = { id: "auto", view: "auto" };
  $: checked = check.id !== "auto" && check.view !== "auto";
  $: action = check.id === "yes" ? "?/accept" : "?/decline";
  $: disabled = check.id === "auto";

  const submit: SubmitFunction = () => {
    if (loading || disabled) return;

    if (!checked) {
      toast.error("Please check all the boxes.");
      return;
    }

    if (check.view === "no" && newView === "") {
      toast.error("Please enter the new value.");
      return;
    }

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message);
      }

      if (form?.state === "success") {
        toast.success(form.message);
      }

      if (form?.promotionId) {
        const { promotionId } = form;

        promotions = promotions.filter((c) => c.id !== promotionId);
      }

      loading = false;
      promotion.id = "";
    };
  };
</script>

<section>
  <div>
    <h3>Promotions to verify</h3>
  </div>

  {#each promotions as { id, views, status, file }}
    <div class="accord">
      <div class="inner">
        <div>{status}</div>

        <div>
          <Svg ds={eyeIcon} dimension="20" />
          <span>{abbrevNum(views)}</span>
        </div>

        <Menu
          dimension="20"
          on:click={() => (promotion = { id, views, file })}
        />
      </div>

      <Accordion {id} block>
        <div>
          This promotion is ready for verification. Kindly take the menu button
          to verify and approve it.
        </div>
      </Accordion>
    </div>
  {:else}
    <div>
      <Empty>
        All promotions have been successfully verified. Please check back later
        for updates. <a href="/studio/campaigns">Return back</a>
      </Empty>
    </div>
  {/each}
</section>

{#if promotion.id}
  {@const { id, file, views } = promotion}

  <Slider
    title="Verify promotion feedback"
    on:click={() => {
      promotion.id = "";
      check.id = "auto";
      check.view = "auto";
    }}
  >
    <form method="POST" use:enhance={submit} {action}>
      <input type="hidden" name="promotionId" value={id} />
      <input type="hidden" name="campaignId" value={campaignId} />
      <input type="hidden" name="views" value={views} />
      <input type="hidden" name="checked" value={checked ? "yes" : "no"} />

      <div class="images">
        <Callout>
          Is the ID & number of views in the screenshot accurate?
        </Callout>

        <img src={file} alt="" />
      </div>

      <div class="info">
        <span>Number of views: <span>{views}</span></span>

        <div>
          <div class="radio">
            <label for="viewYes">Yes</label>
            <input
              type="radio"
              name="view"
              id="viewYes"
              on:change={() => (check.view = "yes")}
            />
          </div>

          <div class="radio last">
            <label for="viewNo">No</label>
            <input
              type="radio"
              name="view"
              id="viewNo"
              on:change={() => (check.view = "no")}
            />
          </div>
        </div>
      </div>

      <div class="info">
        <span>ID: <span>{id}</span></span>

        <div>
          <div class="radio">
            <label for="idYes">Yes</label>
            <input
              type="radio"
              name="id"
              id="idYes"
              on:change={() => (check.id = "yes")}
            />
          </div>

          <div class="radio last">
            <label for="idNo">No</label>
            <input
              type="radio"
              name="id"
              id="idNo"
              on:change={() => (check.id = "no")}
            />
          </div>
        </div>
      </div>

      {#if check.view === "no"}
        <div class="info new" transition:scale>
          <label for="newViews">Enter the views you see</label>
          <input
            type="tel"
            name="newViews"
            id="newViews"
            bind:value={newView}
          />
        </div>
      {/if}

      {#key action}
        <button in:scale {disabled}>
          <Spinner {loading} />
          <span>{action.replace("?/", "")}</span>
        </button>
      {/key}
    </form>
  </Slider>
{/if}

<style>
  form {
    padding: 1rem;
    gap: 2rem;
  }

  form button {
    margin-top: 2rem;
  }

  .inner * {
    font-size: 1rem;
  }

  .info {
    outline: var(--outline);
    flex-direction: row;
    align-items: center;
    padding-inline: var(--gap-base) 0;
    justify-content: space-between;
    border-radius: var(--radius-sm);
  }

  .info > div {
    display: flex;
  }

  .radio {
    border-right: var(--outline);
    border-left: var(--outline);
    box-sizing: border-box;
    padding: var(--gap-base) var(--gap-sml);
  }

  .radio.last {
    border: none;
  }

  .images {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-sm);
  }

  img {
    width: 14rem;
    aspect-ratio: 1/1;
    object-fit: contain;
  }

  .info > span > span {
    color: var(--sec-color);
    margin-left: var(--gap-sml);
  }

  .info.new input {
    outline: none;
    width: 25%;
    border-left: var(--outline);
    box-sizing: border-box;
    border-radius: 0;
    text-align: center;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  }
</style>
