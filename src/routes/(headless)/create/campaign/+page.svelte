<script lang="ts">
  import Head from "$comps/campaign/head.svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import Transition from "$comps/modals/transition.svelte";
  import { campaign, campaignInit } from "$store/campaign";
  import { uuid } from "$helpers/uuid";
  import Format from "$comps/campaign/format.svelte";
  import Cta from "$comps/campaign/cta.svelte";
  import Reach from "$comps/campaign/reach.svelte";
  import Budget from "$comps/campaign/budget.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { applyAction } from "$app/forms";
  import { fetcher } from "$helpers/fetcher";
  import { deleteFromFB, uploadToFB } from "$lib/client/firebase/storage";
  import { tabbed } from "$store/page";
  import { goto } from "$app/navigation";

  export let form;
  export let data;

  let loading = false;
  const folder = "campaigns";
  const length = 20;

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    let file = $campaign.file;

    if (!file.length) {
      toast.error("Upload a media file image");
      loading = false;
      return;
    }

    return async ({ result }) => {
      await applyAction(result);

      let { id } = $campaign;
      let uid = data.user.id;

      if (form?.state === "error") {
        await deleteFromFB(id, folder);
        $campaign.id = uuid({ id: uid, length });
        $campaign.file = "";
        toast.error(form.message);
      }

      if (form?.state === "published") {
        const result = await uploadToFB($campaign.file, folder, id);

        if (result.status === "error") {
          $campaign.id = uuid({ id: uid, length });
          toast.error("Error uploading image file");
          return;
        }

        file = result.url;

        const response = await fetcher("?/update", "POST", {
          file,
          id: form.id,
        });

        const res = await response.json();

        //@ts-ignore
        if (res.type === "success") {
          toast.success("Campaign Created Successfully");
          goto("/studio/campaigns");
        } else {
          await fetcher("?/delete", "POST", { id });
          $campaign.id = uuid({ id: uid, length });
          toast.error("An error occurred. Try again");
        }
      }

      loading = false;
    };
  };

  const load = (_: HTMLElement) => {
    const { id } = data.user;
    $campaign = { ...campaignInit, id: uuid({ id, length }) };
  };
</script>

<section use:load>
  {#if $tabbed === 1}
    <Transition>
      <Format />
    </Transition>
  {/if}

  {#if $tabbed === 2}
    <Transition>
      <Cta />
    </Transition>
  {/if}

  {#if $tabbed === 3}
    <Transition>
      <Reach />
    </Transition>
  {/if}

  {#if $tabbed === 4}
    <Transition>
      <Budget />
    </Transition>
  {/if}
</section>

<Head {loading} {submit} />

<Toaster />
