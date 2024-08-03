<script>
  import Slider from "$comps/modals/slider.svelte";
  import Theme from "$comps/buttons/theme.svelte";
  import { navLinks } from "$lib/client/links";
</script>

<Slider on:click title="Navigation">
  <nav>
    <ul>
      {#each navLinks as { href, title }}
        <li><a {href} on:click>{title}</a></li>
      {/each}
    </ul>

    <hr class="full-bleed" />

    <Theme />

    <hr class="full-bleed" />

    <div class="copyright">
      kordome Youths. All rights reserved &copy; {new Date().getFullYear()}.
    </div>
  </nav>
</Slider>

<style>
  nav {
    padding: 1.3rem var(--gap-sml);
    display: flex;
    flex-direction: column;
    gap: 1.3rem;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem var(--gap-base);
    justify-content: space-between;
  }

  li a {
    display: flex;
    color: currentColor;
    outline: var(--outline);
    padding: var(--gap-micro) var(--gap-sm);
    border-radius: var(--radius-sm);
    font-size: 1rem;
    gap: var(--gap-micro);
    text-transform: capitalize;
  }

  .copyright {
    text-align: center;
  }
</style>
