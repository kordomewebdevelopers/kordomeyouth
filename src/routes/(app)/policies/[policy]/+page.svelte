<script>
  import { page } from "$app/stores";

  let { policy } = $page.params;
</script>

<section>
  <h2>{policy === "terms" ? "terms of use" : `${policy} policies`}</h2>
</section>

<style>
  h2 {
    text-transform: capitalize;
  }
</style>
