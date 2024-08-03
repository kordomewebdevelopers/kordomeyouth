<script lang="ts">
  import Svg from "$comps/modals/svg.svelte";
  import { logoutIcon } from "$lib/client/icons";
  import { applyAction, enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import Spinner from "$comps/modals/spinner.svelte";
  import toast, { Toaster } from "svelte-french-toast";

  let loading = false;

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      if (result.status === 303) {
        toast.success("Logged out successfully.");
      } else {
        toast.error("Error logging out. Try again later.");
      }

      loading = false;
    };
  };
</script>

<form action="/auth/signin?/logout" method="POST" use:enhance={submit}>
  <button>
    <Spinner {loading} size="20" />
    <div>
      <span>Logout</span>
      <span><Svg ds={logoutIcon} dimension="23" /></span>
    </div>
  </button>
</form>

<Toaster />

<style>
  button {
    padding: var(--gap-sml) var(--gap-base);
    width: 100%;
    background-color: transparent;
    color: currentColor;
  }

  div {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>
