<script>
  import Slider from "$comps/modals/slider.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import { emailIcon, phoneIcon, whatsappIcon } from "$lib/client/icons";
  import { whatsappGroupLink } from "$lib/site";
  import Theme from "$comps/buttons/theme.svelte";
  import { page } from "$app/stores";

  export const links = [
    { title: "about", href: "/about" },
    { title: "solutions", href: "/solutions" },
    { title: "wall of love", href: "/wall-off-loves" },
    { title: "advertise", href: "/advertise" },
    { title: "affiliates", href: "/affiliates" },
    { title: "blogs", href: "/blogs" },
    { title: "FAQs", href: "/faqs" },
    { title: "tutorials", href: "/tutorials" },
    { title: "policies", href: "/policies" },
  ];
</script>

<Slider on:click title="khekheli &bull; Menu">
  <nav>
    <ul>
      {#each links as { href, title }}
        <li><a {href} on:click>{title}</a></li>
      {/each}
    </ul>

    <hr class="full-bleed" />

    <ul class="forums">
      <li>
        <a href="tel:+233557686338">
          <span>
            <Svg ds={phoneIcon} dimension="20" />
          </span>
          <span>0557686338</span>
        </a>
      </li>

      <li>
        <a href="mailto:info@khekheli.com">
          <span>
            <Svg ds={emailIcon} dimension="20" />
          </span>
          <span>info@khekheli.com</span>
        </a>
      </li>

      <li>
        <a href={whatsappGroupLink.affiliate}>
          <span>
            <Svg ds={whatsappIcon} dimension="20" stroke={0} />
          </span>
          <span>Affiliate forum</span>
        </a>
      </li>

      <li>
        <a href={whatsappGroupLink.business}>
          <span>
            <Svg dimension="20" ds={whatsappIcon} stroke={0} />
          </span>
          <span>Business forum</span>
        </a>
      </li>
    </ul>

    <hr class="full-bleed" />

    {#if !$page.data.authUser}
      <ul class="buttons">
        <li>
          <a href="/auth/signin?tab=signup" class="button" on:click>
            create a free account
          </a>
        </li>

        <li>
          <a href="/auth/signin?tab=login" class="button-sec" on:click>
            login
          </a>
        </li>
      </ul>
    {/if}

    <Theme />

    <hr class="full-bleed" />

    <div class="copyright">
      khekheli Tech Ltd. All rights reserved &copy; {new Date().getFullYear()}.
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
    gap: 1.5rem var(--gap-sm);
    justify-content: space-around;
  }

  li a:not(.buttons li a) {
    display: flex;
    color: currentColor;
    outline: var(--outline);
    padding: var(--gap-micro) var(--gap-sm);
    border-radius: var(--radius-sm);
    font-size: 1rem;
    gap: var(--gap-micro);
  }

  ul.forums li a:not(.buttons li a) {
    align-items: center;
    padding: var(--gap-micro) var(--gap-sml);
  }

  .copyright {
    text-align: center;
  }
</style>
