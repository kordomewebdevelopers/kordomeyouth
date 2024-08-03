<script>
  import DashLink from "$comps/navs/dashLink.svelte";
  import { policyLinks } from "$lib/client/links";
</script>

<section>
  <div>
    <h1>Policies</h1>

    <DashLink links={policyLinks} />
  </div>
</section>
