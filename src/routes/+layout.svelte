<script lang="ts">
  import "$styles/app.css";
  import { onNavigate } from "$app/navigation";
  import { cookieNotice, theme } from "$store/theme";
  import { Toaster } from "svelte-french-toast";
  import CookieNotice from "$comps/modals/cookieNotice.svelte";

  export let data;

  let { native } = data;

  $: $theme = native.theme;
  $: $cookieNotice = native.cookieNotice;

  onNavigate((navigation) => {
    if (
      !document.startViewTransition ||
      navigation.from?.route.id === navigation.to?.route.id
    )
      return;

    return new Promise((resolve) => {
      document.startViewTransition &&
        document.startViewTransition(async () => {
          resolve();
          await navigation.complete;
        });
    });
  });
</script>

<slot />

<Toaster />

{#if !$cookieNotice}
  <CookieNotice />
{/if}
