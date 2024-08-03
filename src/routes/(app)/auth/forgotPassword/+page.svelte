<script lang="ts">
  import Input from "$comps/form/input.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { applyAction, enhance } from "$app/forms";
  import toast, { Toaster } from "svelte-french-toast";
  import Callout from "$comps/modals/callout.svelte";
  import { scale } from "svelte/transition";

  export let form;

  let loading = false;

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message);
        loading = false;

        return;
      }

      if (form?.state === "success") {
        toast.success(form.message);
      }

      loading = false;
    };
  };
</script>

<section class="vertical">
  <h3>Forgot password reset</h3>

  <form action="?/updatePassword" method="POST" use:enhance={submit}>
    {#if !form?.email}
      <Input type="email" id="email" autocomplete="old-email">
        Enter your current email address
      </Input>
    {/if}

    {#key form?.state}
      <div in:scale>
        {#if form?.email}
          <Callout success>
            Email has been sent to {form.email} for password reset.
          </Callout>
        {:else}
          <Callout info>
            We will send a reset password instruction to the email, if it
            exists.
          </Callout>

          <button>
            <Spinner {loading} />
            <span>request reset password</span>
          </button>
        {/if}
      </div>
    {/key}
  </form>
</section>

<Toaster />

<style>
  form {
    width: 22rem;
    gap: 3rem;
  }

  button {
    width: 100%;
    margin-top: 3rem;
  }
</style>
