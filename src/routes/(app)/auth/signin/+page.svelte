<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast, { Toaster } from "svelte-french-toast";
  import Spinner from "$comps/modals/spinner.svelte";
  import { goto } from "$app/navigation";
  import Tabs from "$comps/modals/tabs.svelte";
  import { tabbed } from "$store/page.js";
  import Transition from "$comps/modals/transition.svelte";
  import Callout from "$comps/modals/callout.svelte";
  import { page } from "$app/stores";
  import Input from "$comps/form/input.svelte";
  import VerifyBot from "$comps/form/verifyBot.svelte";

  export let form;

  let loading = false;
  let open = false;

  const submit: SubmitFunction = () => {
    if ($tabbed === "signup" && !open) {
      open = true;
      return;
    }

    if (loading) return;

    loading = true;

    return async ({ result }) => {
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

<section>
  <Tabs tabs={["login", "signup"]} />
</section>

<section class="vertical">
  {#key $tabbed}
    <Transition>
      <form action="?/{$tabbed}" method="POST" use:enhance={submit}>
        {#if $tabbed === "signup"}
          <Input type="email" id="email" required autocomplete="email">
            Enter your active email address.
          </Input>

          <div class="inter">
            <Input type="password" id="password" autocomplete="new-password">
              Enter a strong password
            </Input>

            <Callout info>
              Use a combination of numbers, symbols, lowercase/uppercase
              characters for a strong password.
            </Callout>
          </div>

          <input
            type="hidden"
            name="ref_id"
            value={$page.url.searchParams.get("ref_id") || ""}
          />

          {#if open}
            <VerifyBot on:click={() => (open = false)} {loading} />
          {/if}

          <button type="button" on:click={() => (open = true)}>
            <Spinner size="20" {loading} />
            <span>{$tabbed}</span>
          </button>
        {/if}

        {#if $tabbed === "login"}
          <Input type="email" id="email" required autocomplete="email">
            Enter your email address.
          </Input>
          <div>
            <Input type="password" id="password" autocomplete="old-password">
              Enter your password.
            </Input>
            <a href="/auth/forgotPassword"> I forgot my password</a>
          </div>

          <button>
            <Spinner size="20" {loading} />
            <span>{$tabbed}</span>
          </button>
        {/if}
      </form>
    </Transition>
  {/key}
</section>

<Toaster />

<style>
  .vertical {
    margin-top: -3rem;
  }

  form {
    width: 22rem;
  }

  button {
    gap: var(--gap-sm);
    width: 100%;
  }

  .inter {
    display: flex;
    flex-direction: column;
    gap: var(--gap-base);
  }

  a {
    margin-top: var(--gap-base);
  }
</style>
