<script lang="ts">
  import Input from "$comps/form/input.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { applyAction, enhance } from "$app/forms";
  import toast, { Toaster } from "svelte-french-toast";

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
  <h2>Manage password</h2>

  <form action="?/updatePassword" method="POST" use:enhance={submit}>
    <Input type="password" id="oldPassword" autocomplete="old-password">
      Enter your existing password
    </Input>

    <div>
      <Input type="password" id="password" autocomplete="new-password">
        Enter the new password
      </Input>

      <a href="/auth/forgotPassword"> I forgot my password</a>
    </div>

    <button>
      <Spinner {loading} />
      <span>change password</span>
    </button>
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

  a {
    margin-top: var(--gap-base);
  }
</style>
