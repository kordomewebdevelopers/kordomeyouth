<script>
  import Svg from "$comps/modals/svg.svelte";
  import { formatCurrency, getEarnDesc } from "$helpers/formats";
  import { walletIcon } from "$lib/client/icons";

  export let earn = 0;
  export let title = "";
</script>

<div class="wrap">
  <div>
    <span class="heading">
      {title}
      {#if title !== "wallet"}
        earn
      {/if}
    </span>
    <span>{getEarnDesc(title)}</span>
  </div>

  <div>
    <div class="heading earn">
      {formatCurrency(earn, "GHC")}
    </div>

    <button type="button">
      <Svg ds={walletIcon} dimension="18" />
      <span>cashout</span>
    </button>
  </div>
</div>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    width: 8.4rem;
    outline: var(--outline);
    padding: var(--gap-base);
    border-radius: var(--radius-sm);
  }

  .wrap > div {
    display: flex;
    flex-direction: column;
    gap: var(--gap-nano);
    width: 100%;
  }

  .wrap > div div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .heading {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    gap: var(--gap-micro);
    color: var(--prim-color);
  }

  .wrap div .heading.earn {
    display: block;
    word-wrap: break-word;
  }

  button {
    padding: var(--gap-micro) var(--gap-base);
    background-color: transparent;
    color: currentColor;
    margin-top: 0.5rem;
    justify-content: space-between;
    border-radius: var(--radius-lg);
    margin-top: var(--gap-sm);
    font-size: small;
  }
</style>
