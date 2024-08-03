<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-french-toast";
  import Spinner from "$comps/modals/spinner.svelte";
  import { page } from "$app/stores";
  import Selector from "$comps/form/selector.svelte";
  import { regions } from "$lib/data/regions";
  import { getCities } from "$lib/site/cities";
  import { goto } from "$app/navigation";
  import Callout from "$comps/modals/callout.svelte";
  import Input from "$comps/form/input.svelte";

  export let form;

  let loading = false;

  let items = regions.map((r) => (r === "nationwide" ? "select" : r));

  $: region = items[0];
  $: cities = ["select", ...getCities(region)];
  $: city = cities[0];

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      loading = false;

      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message);
        loading = false;
      }

      if (form?.state === "success") {
        toast.success(form.message);
        goto(form.to || "", { invalidateAll: true });
      }
    };
  };
</script>

<section class="vertical">
  <form method="POST" use:enhance={submit}>
    <Input type="text" id="name">Enter your names (first & second)</Input>

    <Input type="tel" id="phone">Enter your phone number (0549845873)</Input>

    <div>
      <label for="regions">Select your region</label>
      <Selector
        {items}
        on:pick={(e) => {
          region = e.detail;
          cities = ["select", ...getCities(region)];
        }}
      />
      <input type="hidden" name="region" value={region} />
    </div>

    <div>
      <label for="regions">Select a city nearby</label>
      <Selector items={cities} on:pick={(e) => (city = e.detail)} />
      <input type="hidden" name="city" value={city} />
    </div>

    <input
      type="hidden"
      name="ref"
      value={$page.url.searchParams.get("ref") || ""}
    />

    <Callout info>
      By submitting, you agree to
      <a href="/policies">these policies</a>
    </Callout>

    <button>
      <Spinner {loading} />
      <span>submit & join</span>
    </button>
  </form>
</section>

<style>
  form {
    gap: 1.9rem;
  }

  button {
    width: 100%;
  }
</style>
