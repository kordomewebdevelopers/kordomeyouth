<script>
  import toast from "svelte-french-toast";

  /**
   * @typedef {import("svelte/elements").HTMLInputTypeAttribute} InputType
   */

  /**
   * @type {InputType}
   */
  export let type = "text";
  export let id = "";
  export let label = true;

  let value = "";

  const past = async () => {
    try {
      value = await navigator.clipboard.readText();
      toast.success("Pasted successfully");
    } catch {
      toast.error("Cannot paste. Type it rather");
    }
  };
</script>

<div>
  {#if label}
    <label for={id}><slot /></label>
  {/if}
  <div class="inline-control">
    <input {type} {id} name={id} value={value.slice(0, 34)} />
    <button type="button" on:click={past}>past</button>
  </div>
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
