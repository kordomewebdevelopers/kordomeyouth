<script>
  import Main from "$comps/layouts/main.svelte";
  import Header from "$comps/layouts/header.svelte";
  import Meta from "$comps/modals/meta.svelte";
</script>

<Meta />

<Header />

<Main>
  <slot />
</Main>
