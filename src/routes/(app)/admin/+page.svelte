<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import Input from "$comps/form/input.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-french-toast";

  export let form;

  let loading = false;

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message);
      }

      loading = false;
    };
  };
</script>

<section class="vertical">
  <form use:enhance={submit} method="POST">
    <Input type="email" id="email">Enter your admin email</Input>
    <Input type="password" id="password">Enter your admin password</Input>

    <button>
      <Spinner {loading} />
      <span>login as admin</span>
    </button>
  </form>
</section>

<style>
  form {
    gap: 4rem;
  }

  button {
    width: 100%;
    margin-top: 2rem;
  }
</style>
