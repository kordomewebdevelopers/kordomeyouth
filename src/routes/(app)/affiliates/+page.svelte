<script>
  import DashLink from "$comps/navs/dashLink.svelte";
  import { affiliateLinks } from "$lib/client/links";
</script>

<section>
  <div>
    <h1>Affiliates</h1>

    <DashLink links={affiliateLinks} />
  </div>
</section>
