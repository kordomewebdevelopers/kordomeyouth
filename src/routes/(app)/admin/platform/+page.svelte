<script>
  import DashLink from "$comps/navs/dashLink.svelte";
  import { platformLinks } from "$lib/client/links";
</script>

<section>
  <h3>Platform stats</h3>

  <DashLink links={platformLinks} />
</section>
