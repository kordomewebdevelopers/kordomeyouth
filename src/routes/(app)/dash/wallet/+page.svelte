<script lang="ts">
  import { applyAction } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast, { Toaster } from "svelte-french-toast";
  import { CASHOUT_CAP, MAX_CASHOUT } from "$lib/client/constants";
  import Callout from "$comps/modals/callout.svelte";
  import Earn from "$comps/ui/earn.svelte";
  import Invitation from "$comps/ui/invitation.svelte";
  import Goto from "$comps/buttons/goto.svelte";

  type Toggle = "auto" | "claim" | "redeem" | "cashout";

  export let data;
  export let form;

  let { affiliate, referral, count, shop, invites, wallet } = data.earns;

  let disabled = false;
  let submitting = false;
  let toggle: Toggle = "auto";

  const submit: SubmitFunction = () => {
    if (submitting) return;

    disabled = true;
    submitting = true;

    return async ({ result }) => {
      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message, { duration: 5000 });
      }

      if (form) {
        referral = form.referral || referral;
        affiliate = form.affiliate || affiliate;
        count = form.count || count;
      }

      if (form?.state === "success") {
        toast.success(form.message, { duration: 10000 });
      }

      disabled = false;
      submitting = false;
      toggle = "auto";
    };
  };
</script>

<section>
  <div>
    <div>
      <h2>
        <span>Wallets</span>
        <Goto href="/dash/cashouts" title="cashouts" />
      </h2>

      <Callout>
        Cashout is capped from
        <span class="highlight">GHC {CASHOUT_CAP.min}</span>
        to
        <span class="highlight">GHC {CASHOUT_CAP.max}</span>. You can make
        <span class="highlight">{MAX_CASHOUT}</span> cashout requests in a month
        and on the following days
        <span class="highlight">(Mon, Tue, & Wed)</span>. You have made
        <span class="highlight">{count}</span>
        so far, in this month.
      </Callout>
    </div>

    <div class="earns">
      <Earn earn={affiliate} title="affiliate" />
      <Earn earn={referral} title="referral" />
      <Earn earn={shop} title="shop" />
      <Earn earn={wallet} title="wallet" />
    </div>

    <div>
      <h3>Invitation & Referrals</h3>

      <Invitation {invites} />
    </div>
  </div>
</section>

<Toaster />

<!-- {#if toggle === "cashout"}
  <Cashout

    on:click={() => (toggle = "auto")}
    {disabled}
    total={personal + refer}
    {submit}
  />
{/if} -->

<style>
  h2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
  }

  .earns {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--gap-base);
    justify-content: space-between;
  }

  .highlight {
    color: var(--sec-color);
  }
</style>
