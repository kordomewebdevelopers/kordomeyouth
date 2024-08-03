<script>
  import DashLink from "$comps/navs/dashLink.svelte";
  import { studioLinks } from "$lib/client/links";
</script>

<section>
  <h1>Ad Studio</h1>

  <DashLink links={studioLinks} />
</section>
