<script>
  import DashLink from "$comps/navs/dashLink.svelte";
  import { adminLinks } from "$lib/client/links";
</script>

<section>
  <h3>Admin Dashboard</h3>

  <DashLink links={adminLinks} />
</section>
