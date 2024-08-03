<script>
  export let data;

  let { total, table, year, records } = data;
</script>

<section>
  <div>
    <h3>{table} ({year})</h3>

    <div class="wrapper">
      <div>
        <span>total</span>
        <span>{total}</span>
      </div>

      {#each records as { title, value }}
        <div>
          <span>{title}</span>
          <span>{value}</span>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  h3 {
    text-transform: capitalize;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
  }

  .wrapper div {
    outline: var(--outline);
    display: flex;
    justify-content: space-between;
    padding: var(--gap-micro) var(--gap-sm);
    text-transform: uppercase;
    border-radius: var(--radius-sm);
    align-items: center;
  }

  .wrapper div span:last-child {
    font-size: 1.5rem;
    font-weight: bolder;
    color: var(--sec-color);
  }
</style>
