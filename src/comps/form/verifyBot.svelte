<script lang="ts">
  import Callout from "$comps/modals/callout.svelte";
  import Slider from "$comps/modals/slider.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import { noBotIcon } from "$lib/client/icons";
  import { scale } from "svelte/transition";

  export let loading = false;
  export let formaction = "?/signup";

  let holding = false;
  let verified = false;
  let verifying = false;
  let holdTimeout: NodeJS.Timeout;
  let verifyTimeout: NodeJS.Timeout;
  let duration = { hold: 8000, verify: 2000 };

  const hold = (node: HTMLButtonElement) => {
    const start = () => {
      holding = true;

      holdTimeout = setTimeout(() => {
        holding = false;
        verifying = true;

        verifyTimeout = setTimeout(() => {
          verifying = false;
          verified = true;
        }, duration.verify);
      }, duration.hold);
    };

    const end = () => {
      if (!verifying) {
        holding = false;
        clearTimeout(holdTimeout);
      } else {
        clearTimeout(verifyTimeout);
        verifying = false;
      }
    };

    node.addEventListener("mousedown", start);
    node.addEventListener("touchstart", start);
    document.addEventListener("mouseup", end);
    document.addEventListener("touchend", end);

    return {
      destroy() {
        node.removeEventListener("mousedown", start);
        node.removeEventListener("touchstart", start);
        document.removeEventListener("mouseup", end);
        document.removeEventListener("touchend", end);
      },
    };
  };
</script>

<Slider title="Verify you're not a bot" on:click>
  <div>
    <span><Svg ds={noBotIcon} dimension="100" /></span>
    <Callout success={verified}>
      {#if verified}
        <span in:scale>
          You have successfully verified, to be a human. You can now signup
        </span>
      {:else}
        Click (touch) and hold the button to the end so we can make sure you're
        not a bot.
      {/if}
    </Callout>

    {#if verified}
      <button in:scale {formaction}>
        <Spinner {loading} size="20" />
        <span>signup</span>
      </button>
    {:else if verifying}
      <button type="button" in:scale>verifying...</button>
    {:else}
      <button use:hold type="button" class:holding class="hold" in:scale>
        touch and hold to the end
      </button>
    {/if}
  </div>
</Slider>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
    padding: var(--gap-md);
    justify-content: center;
  }

  span {
    margin: 0 auto;
  }

  button {
    width: 100%;
  }

  .hold {
    background-color: transparent;
    color: currentColor;
    overflow: hidden;
    position: relative;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: none;
  }

  .hold::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background-color: var(--prim-color);
    transition: left 8s ease-in-out;
  }

  .hold.holding::before {
    left: 0;
  }
</style>
