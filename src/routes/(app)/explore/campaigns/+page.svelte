<script lang="ts">
  import Slider from "$comps/modals/slider.svelte";
  import { applyAction, enhance } from "$app/forms";
  import Spinner from "$comps/modals/spinner.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast, { Toaster } from "svelte-french-toast";
  import { scale } from "svelte/transition";
  import Svg from "$comps/modals/svg.svelte";
  import { downloadIcon } from "$lib/client/icons";
  import { getRefLink } from "$helpers/formats";
  import { copyText } from "$helpers/formats";
  import { watermark } from "$helpers/image";
  import { uuid } from "$helpers/uuid";
  import { downloadFromFB } from "$lib/client/firebase/storage";
  import Empty from "$comps/modals/empty.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Callout from "$comps/modals/callout.svelte";
  import TabRoute from "$comps/modals/tabRoute.svelte";
  import Goto from "$comps/buttons/goto.svelte";

  export let data;
  export let form;

  let { campaigns, user, tab, length } = data;

  let campaign = { id: "", file: "", link: "", promotionId: "" };
  let src = "";
  let tabs = ["others", "own"];

  let loading = false;

  const submit: SubmitFunction = () => {
    if (loading) return;

    if (length >= 10) {
      toast.error("You can only have 10 promotions in every 24hrs.");
      return;
    }

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message, { duration: 10000 });
      }

      if (form?.length && form.state === "success") {
        src = await downloadFromFB(campaign.id, "campaigns");
        src = await watermark(src, campaign.promotionId, "w");
        length = form.length;
        goto(`${$page.url.pathname}?length=${length}`);
        toast.success(form.message, { duration: 10000 });
      }

      loading = false;
    };
  };

  const copyLink = async (link: string) => {
    await copyText(link);

    toast.success("Link copied successfully ");
  };
</script>

<section>
  <div>
    <div>
      <h3>Campaigns to promote</h3>
      <p>Click on any campaign card to promote.</p>
    </div>

    <div class="flow-wide">
      <Goto title="promotions" href="/affiliates/promotions" right />
      <TabRoute {tab} {tabs} />
    </div>
  </div>

  <div class="campaigns">
    {#each campaigns as { id, file, link }}
      <button
        on:click={() => {
          campaign = {
            id,
            file,
            link,
            promotionId: uuid({ length: 11 }),
          };
        }}
      >
        <img src={file} alt="" />
        <span>promote</span>
      </button>
    {:else}
      <div>
        <Empty info>
          All clear, campaigns are not available at the moment.
        </Empty>
      </div>
    {/each}
  </div>
</section>

{#if campaign.id}
  {@const { file, id, link, promotionId } = campaign}
  @const {origin} = 1page.url
  {@const shareLink = link.length
    ? `${origin}/return?id=${id}&link=${encodeURIComponent(link)}`
    : getRefLink(user.id, origin)}
  <Slider
    title="About to promote this campaign"
    on:click={() => (campaign.id = "")}
  >
    <form action="?/promote" method="POST" use:enhance={submit}>
      <input type="hidden" name="campaign_id" value={id} />
      <input type="hidden" name="promotionId" value={promotionId} />
      <input type="hidden" name="campaign_file" value={file} />
      <input type="hidden" name="length" value={length} />

      {#if src.length}
        <div in:scale class="infos">
          <Callout>
            <span>
              Tap to copy the link below and add it together when sharing on
              your status.
            </span>

            <button
              class="copy"
              type="button"
              on:click={() => copyLink(shareLink)}
            >
              {shareLink.slice(0, 55)}
            </button>
          </Callout>

          <Callout>
            <span>
              Download and share this campaign on your Whatsapp status.
            </span>

            <a href={src} download={promotionId} class="button download">
              <Svg ds={downloadIcon} dimension="32"></Svg>
              <span>Download</span>
            </a>
          </Callout>
        </div>
      {:else}
        <img src={file} alt="" />
      {/if}

      <div class="flow-wide">
        {#if src.length}
          <button
            class="button done"
            in:scale
            type="button"
            on:click={() => {
              campaign.id = "";
              src = "";
            }}
          >
            Done
          </button>
        {:else}
          <button
            type="button"
            class="button-shadow"
            on:click={() => (campaign.id = "")}
          >
            cancel
          </button>

          <button style="width: 90%;">
            <Spinner {loading}></Spinner>
            <span>promote</span>
          </button>
        {/if}
      </div>
    </form>
  </Slider>
{/if}

<Toaster />

<style>
  .campaigns {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--gap-sm);
    justify-content: center;
  }

  .campaigns button {
    padding: 0;
    background-color: transparent;
    color: currentColor;
    display: flex;
    flex-direction: column;
    outline: none;
    gap: 0;
  }

  .campaigns button img {
    width: 9.5rem;
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    border: var(--outline);
    box-sizing: border-box;
  }

  .campaigns button span {
    border: var(--outline);
    box-sizing: border-box;
    border-top: none;
    width: 100%;
    border-radius: 0 0 var(--radius-sm) var(--radius-sm);
    padding: var(--gap-micro) 0;
    font-size: 0.8rem;
  }

  img {
    border-radius: var(--radius-sm);
  }

  form {
    padding: 1rem;
  }

  button.copy {
    width: 100%;
    border-radius: 0;
    padding: 0;
    background-color: transparent;
    color: currentColor;
    outline: none;
    text-decoration: underline;
    justify-content: start;
    text-transform: lowercase;
    font-size: 1.2rem;
    text-align: left;
  }

  a.download {
    margin-top: 1rem;
    width: max-content;
    padding: 0;
    background-color: transparent;
    color: currentColor;
    outline: none;
    text-decoration: underline;
    font-size: 1.5rem;
  }

  button.done {
    width: 100%;
  }

  .infos {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }
</style>
