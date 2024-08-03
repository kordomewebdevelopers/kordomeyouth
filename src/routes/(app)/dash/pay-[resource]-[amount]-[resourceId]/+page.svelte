<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import Spinner from "$comps/modals/spinner.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import { successIcon } from "$lib/client/icons";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-french-toast";

  export let data;
  export let form;

  let { resource, coupon, resourceId, amount, pay } = data.options;
  let action = pay === "0" ? "complete" : "pay";
  let transact_id = coupon === "demo" ? coupon : "";
  let loading = false;
  let button = "auto";

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message);
      }

      if (form?.state === "success" || form?.state === "completed") {
        toast.success(form.message);
      }

      if (form?.state === "completed") {
        history.back();
      }

      loading = false;
    };
  };
</script>

<section>
  <div>
    <h1>
      <span>Payment</span>
      <div>
        <Svg ds={successIcon} dimension="20" />
        <span>secured</span>
      </div>
    </h1>

    <form action="?/coupon" method="POST" use:enhance={submit}>
      <div>
        <label for="code">Apply a coupon</label>
        <div class="inline-control">
          <input type="text" name="code" id="code" value={coupon} />
          <button disabled={!!coupon} on:click={() => (button = "apply")}>
            <span>apply</span>
            {#if button === "apply"}
              <Spinner {loading} />
            {/if}
          </button>
        </div>
      </div>
    </form>

    <form action="?/{action}" method="POST" use:enhance={submit}>
      <input type="hidden" name="resource" value={resource} />
      <input type="hidden" name="resourceId" value={resourceId} />
      <input type="hidden" name="coupon" value={coupon} />
      <input type="hidden" name="amount" value={pay} />
      <input type="hidden" name="transact_id" value={transact_id} />

      <div>
        <label for="amount">Original Amount (GHC)</label>
        <input type="text" name="amount" id="amount" value={amount} readonly />
      </div>

      <div>
        <label for="amount">Amount to Pay (GHC)</label>
        <input type="text" name="amount" id="amount" value={pay} readonly />
      </div>

      <button on:click={() => (button = "pay")}>
        <span>{action}</span>
        {#if button === "pay"}
          <Spinner {loading} />
        {/if}
      </button>
    </form>
  </div>
</section>

<style>
  h1 {
    display: flex;
    align-items: center;
    gap: var(--gap-base);

    & div {
      display: flex;
      align-items: center;
      font-size: 1.3rem;
      gap: var(--gap-nano);
      color: var(--prim-color);
    }
  }

  form {
    gap: 2.5rem;

    & + form {
      margin-top: 1.5rem;
    }
  }

  button {
    margin-top: 2rem;
  }

  .inline-control button {
    background-color: var(--sec-color);
    color: var(--dark-text);
    margin: 0;
  }
</style>
