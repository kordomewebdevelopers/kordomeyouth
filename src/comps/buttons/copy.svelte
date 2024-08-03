<script>
  import { copyText } from "$helpers/formats";
  import toast from "svelte-french-toast";

  export let data = "";

  const copy = async () => {
    await copyText(data);

    toast.success("Successfully copied");
  };
</script>

<div class="inline-control">
  <input type="text" readonly value={data.slice(0, 34)} />
  <button type="button" on:click={copy}>copy</button>
</div>

<style>
  div {
    width: 100%;
  }

  button {
    border-radius: 0;
    padding: var(--gap-base) var(--gap-small);
  }
</style>
