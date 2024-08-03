<script>
  import Svg from "$comps/modals/svg.svelte";
  import { lockIcon } from "$lib/client/icons";
  import { games } from "$lib/data/games";
</script>

<ul class="cards">
  {#each games as { title, thumbnail, slug, description, disabled }}
    {@const href = disabled ? "#" : slug}
    <li>
      <a {href}>
        <img src={thumbnail} alt={title} />

        <div>
          <div>
            <span class="heading">
              <span>{title}</span>
              {#if disabled}
                <Svg ds={lockIcon} dimension="18" />
              {/if}
            </span>
            <p>{description}</p>
          </div>
        </div>
      </a>
    </li>
  {/each}
</ul>

<style>
  .heading {
    display: flex;
    align-items: center;
    gap: var(--gap-smallest);
    margin-bottom: var(--gap-micro);
  }
</style>
