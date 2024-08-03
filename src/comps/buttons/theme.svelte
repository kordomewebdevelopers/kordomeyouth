<script lang="ts">
  import { enhance } from "$app/forms";
  import Selector from "$comps/form/selector.svelte";
  import { theme, type Theme } from "$store/theme";

  const themes: Theme[] = ["light", "dark", "night", "system"];

  let select: Theme = $theme;
</script>

<form
  method="POST"
  action="/api/theme"
  use:enhance={() => {
    $theme = select;
  }}
>
  <input type="hidden" name="theme" value={select} />

  <Selector
    items={themes}
    on:pick={({ detail }) => (select = detail)}
    title="Using {select} theme"
    type="submit"
    {select}
  />
</form>
