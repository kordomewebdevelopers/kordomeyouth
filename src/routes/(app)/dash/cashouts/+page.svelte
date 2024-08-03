<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import Accordion from "$comps/modals/accordion.svelte";
  import Callout from "$comps/modals/callout.svelte";
  import Slider from "$comps/modals/slider.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import { deleteIcon, arrowLeftIcon } from "$lib/client/icons";
  import { cashoutInfo } from "$helpers/infos";
  import { formatDate } from "$helpers/formats";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast, { Toaster } from "svelte-french-toast";
  import { whatsappGroupLink } from "$lib/site";
  import Empty from "$comps/modals/empty.svelte";

  export let data;
  export let form;

  let { cashouts, user } = data;

  type ActionBtn = "remove" | "auto" | "recashout";

  let disabled = false;
  let recordId = "";
  let action: ActionBtn = "auto";

  const submit: SubmitFunction = () => {
    disabled = true;

    return async ({ result }) => {
      disabled = false;

      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message, { duration: 5000 });
      }

      if (form?.state === "success") {
        cashouts = form.cashouts || cashouts;

        cashouts = form.cashouts || cashouts;

        action = "auto";
        recordId = "";
        toast.success(form.message, { duration: 5000 });
      }
    };
  };
</script>

<section>
  <div>
    <div>
      <h2>Cashouts</h2>

      <Callout info>
        Cashouts are processed on fridays and saturdays. Kindly
        <a href={whatsappGroupLink.affiliate}>send your issues to us here.</a>
      </Callout>
    </div>

    <div class="history">
      {#each cashouts as { name, account, id, spend, date, status }}
        <div class="cashout">
          <div class="inner">
            <span class="status {status}">{status}</span>

            {#if status === "success" || status === "rejected"}
              <button
                on:click={() => {
                  action = "remove";
                  recordId = id;
                }}
              >
                <Svg ds={deleteIcon} dimension="20" />
              </button>
            {/if}

            {#if status === "mismatched"}
              <button
                on:click={() => {
                  action = "recashout";
                  recordId = id;
                }}
              >
                <Svg ds={arrowLeftIcon} dimension="20" />
              </button>
            {/if}
          </div>

          <Accordion title="GHC {spend}" {id}>
            <div class="wrap">
              <span>{name}</span>
            </div>

            <div class="wrap">
              <span>Account</span>
              <span>{account}</span>
            </div>

            <div class="wrap">
              <span>Date</span>
              <span>{formatDate(date)}</span>
            </div>

            <div class="wrap">
              <span>Info</span>
              <span>{cashoutInfo(status)}</span>
            </div>

            <div class="wrap">
              <span>ID</span>
              <span>{id}</span>
            </div>
          </Accordion>
        </div>
      {:else}
        <Empty>All clear. No cashout made at at the moment.</Empty>
      {/each}
    </div>
  </div>
</section>

{#if recordId}
  <Slider title="{action} transaction" on:click={() => (recordId = "")}>
    <form method="POST" action="?/{action}" use:enhance={submit}>
      {#if action === "recashout"}
        <div>
          <label for="account">Enter account number</label>
          <input type="tel" name="account" id="account" value={user.phone} />
        </div>

        <div>
          <label for="name">Enter account name</label>
          <input type="text" name="name" id="name" value={user.name} />
        </div>
      {/if}

      {#if action === "remove"}
        <div class="info">You're about to remove this record. Continue?</div>
      {/if}

      <input type="text" name="id" value={recordId} readonly />

      <button {disabled}>
        <Spinner loading={disabled} />
        <span>submit</span>
      </button>
    </form>
  </Slider>
{/if}

<Toaster />

<style>
  .settings button > div span {
    text-transform: initial;
  }

  section > div {
    width: 100%;
  }

  .history {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .cashout {
    width: 100%;
    border-radius: var(--radius-lg);
    position: relative;
  }

  .cashout .inner {
    position: absolute;
    top: 1rem;
    left: 8rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 47%;
  }

  .cashout .wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cashout button {
    padding: var(--gap-micro) var(--gap-base);
    background-color: transparent;
    color: currentColor;
    z-index: 100;
    outline: none;
  }

  .wrap + .wrap {
    margin-top: var(--gap-medium);
  }

  .wrap span:nth-child(2) {
    color: var(--accent-color);
  }

  .status {
    text-transform: uppercase;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
    font-size: 0.9rem;
    outline: none;
  }

  .status.success,
  .status.okay {
    border: none;
    color: var(--prim-color);
  }

  .cashout
    .inner:has(
      .status.success,
      .status.invalid,
      .status.mismatched,
      .status.okay
    ) {
    top: 0.5rem;
  }

  .status.mismatched,
  .status.invalid {
    color: #f9a9a9;
  }

  form {
    padding: 2rem;
  }
</style>
