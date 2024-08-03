<script>
  /**
   * @typedef {import("svelte/elements").HTMLInputTypeAttribute} Attribute
   */

  /**
   * @type {Attribute}
   */
  export let type = "text";
  export let id = "email";
  export let value = "";
  export let required = false;
  export let autocomplete = "";

  const passCheck = type;

  const reveal = () => {
    type = type === "password" ? "text" : "password";
    const input = document.getElementById(id);
    input && input.focus();
  };
</script>

<div>
  <label for={id}>
    <slot />
  </label>

  {#if passCheck === "password"}
    <div class="inline-control">
      <input {type} name={id} {id} {required} {value} {autocomplete} />
      <button type="button" on:click={reveal}>
        {type === "password" ? "show" : "hide"}
      </button>
    </div>
  {:else}
    <input {type} name={id} {id} {required} {value} {autocomplete} />
  {/if}
</div>
