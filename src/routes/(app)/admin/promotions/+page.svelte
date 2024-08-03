<script>
  import Accordion from "$comps/modals/accordion.svelte";
  import Empty from "$comps/modals/empty.svelte";

  export let data;

  let { promotions } = data;
</script>

<section>
  <h3>Promotions to approve</h3>

  {#each promotions as { id, status }}
    <div class="accord">
      <div class="inner">
        <a href="/admin/promotions/{id}">
          {id} - {status}
        </a>
      </div>

      <Accordion {id} block>
        <div>This promotion is ready for approval.</div>
      </Accordion>
    </div>
  {:else}
    <div>
      <Empty>
        All promotions have been successfully verified. Please check back later
        for updates.
      </Empty>
    </div>
  {/each}
</section>
