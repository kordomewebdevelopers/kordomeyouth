<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import Accordion from "$comps/modals/accordion.svelte";
  import Hero from "$comps/modals/hero.svelte";
  import Slider from "$comps/modals/slider.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import { formatDate } from "$helpers/formats";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast, { Toaster } from "svelte-french-toast";
  import Callout from "$comps/modals/callout.svelte";
  import Goto from "$comps/buttons/goto.svelte";
  import { whatsappGroupLink } from "$lib/site";
  import Menu from "$comps/buttons/menu.svelte";
  import { getOrderInfo } from "$helpers/infos";

  export let data;
  export let form;

  let { orders } = data;

  let disabled = false;
  let order = { id: "", status: "" };

  const submit: SubmitFunction = () => {
    disabled = true;

    return async ({ result }) => {
      disabled = false;

      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message, { duration: 5000 });
      }

      if (form?.state.includes("success")) {
        toast.success(form.message, { duration: 5000 });
        order = { id: "", status: "" };
      }

      if (form?.orderId && form.receiver) {
        const { orderId, receiver } = form;
        orders = orders.map((item) => {
          return item.id === orderId ? { ...item, receiver } : item;
        });
      }

      if (form?.state.includes("removed")) {
        orders = orders.filter((order) => order.id !== form?.orderId);
      }
    };
  };
</script>

<section>
  <div>
    <h3>
      <Goto href="/offers" title="offers" right />
      <span>Your Orders</span>
    </h3>

    <Callout info>
      Orders may take up to 30 minutes to be delivered. Kindly
      <a href={whatsappGroupLink.affiliate}>send your issues to us here</a>
    </Callout>
  </div>

  {#each orders as { pack, network, id, date, status, receiver, amount }}
    <div class="accord">
      <div class="inner">
        <span class="status {status}">{pack}</span>
        <span>{network}</span>
        <span>GHC {amount}</span>

        <Menu on:click={() => (order = { id, status })} dimension="16" />
      </div>

      <Accordion {id}>
        <div class="wrap">
          <span>Status</span>
          <span class="status {status}">{status}</span>
        </div>

        <div class="wrap">
          <span>Receiver</span>
          <span>{receiver}</span>
        </div>

        <div class="wrap">
          <span>Date</span>
          <span>{formatDate(date)}</span>
        </div>

        <div class="wrap">
          <span>ID</span>
          <span>{id}</span>
        </div>

        <div class="wrap info">
          {getOrderInfo(status)}
        </div>
      </Accordion>
    </div>
  {:else}
    <div>
      <Hero />
      <div class="info">
        <span>
          All set. No order activity at the moment. Use the buttons at the top
          to <a href="#orders">make a quick order</a>.
        </span>
      </div>
    </div>
  {/each}
</section>

{#if order.id}
  {@const { id, status } = order}
  <Slider title="Action on order" on:click={() => (order.id = "")}>
    <form method="POST" use:enhance={submit}>
      <input type="hidden" name="orderId" value={id} />

      <Callout>{getOrderInfo(status)}</Callout>

      {#if status === "unmatched"}
        <div>
          <label for="receiver">Enter the correct receiver number</label>
          <input type="tel" name="receiver" id="receiver" />
        </div>

        <button formaction="?/change">
          <Spinner loading={disabled} />
          <span>submit</span>
        </button>
      {/if}

      {#if status === "success"}
        <button formaction="?/remove">
          <Spinner loading={disabled} />
          <span>remove order</span>
        </button>
      {/if}
    </form>
  </Slider>
{/if}

<Toaster />

<style>
  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .history {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .status {
    text-transform: uppercase;
  }

  form {
    padding: 2rem 1rem;
  }

  form button {
    width: 100%;
  }
</style>
