<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import Input from "$comps/form/input.svelte";
  import Logo from "$comps/layouts/logo.svelte";
  import Callout from "$comps/modals/callout.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-french-toast";

  export let data;
  export let form;

  let { action, result, token } = data;
  let isReset = action === "passwordReset";
  let loading = false;

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

      if (form?.to) {
        goto(form.to, { invalidateAll: true });
      }

      loading = false;
    };
  };
</script>

<section class="vertical">
  <div>
    <h1><a href="/"><span>khekheli</span> <Logo size="30" /></a></h1>
  </div>

  {#if action === "emailVerification"}
    {#if result === "success"}
      <Callout success>
        Your email address is successfully verified. You can
        <a href="/">navigate to dashboard</a>
      </Callout>

      <a href="/" class="button">navigate to dashboard</a>
    {/if}

    {#if result === "error"}
      <Callout info>
        Failed to verify your email. Take the button bellow to resend email
        verification
      </Callout>

      <form action="?/reset" method="POST" use:enhance={submit}>
        <button class="button-sec">
          <Spinner {loading} />
          <span>Resend email verification</span>
        </button>
      </form>
    {/if}
  {:else}
    {@const autocomplete = isReset ? "new-password" : "old-password"}
    {#if isReset}
      <Callout info>
        Enter a new password for password reset of your khekheli account.
      </Callout>
    {:else}
      <Callout info>
        Enter your current password and the new email to change of your khekheli
        account.
      </Callout>
    {/if}

    <form action="?/{action}" method="POST" use:enhance={submit}>
      {#if !isReset}
        <Input type="email" id="email" autocomplete="new-email">
          Enter the new email address to change.
        </Input>
      {/if}

      <Input type="password" id="password" {autocomplete}>
        Enter your {isReset ? "new" : "current"} password
      </Input>

      <input type="hidden" name="token" value={token} />

      <button>
        <Spinner {loading} />
        {isReset ? "reset password & login" : "change email & login"}
      </button>
    </form>
  {/if}
</section>

<style>
  button {
    width: 100%;
    margin-top: 3rem;
  }

  h1 {
    text-align: center;
  }

  form {
    margin-top: 2rem;
  }

  button.button-sec {
    background-color: var(--sec-color);
    outline-color: var(--sec-color);
    color: black;
    margin: 0;
  }
</style>
