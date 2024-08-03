<script>
  const links = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
    { name: "Support", href: "/support" },
    { name: "FAQs", href: "/faqs" },
    { name: "Policies", href: "/policies" },
  ];
</script>

<footer>
  <ul>
    {#each links as { name, href }}
      <li>
        <a data-sveltekit-reload {href}>{name}</a>
      </li>
    {/each}
  </ul>

  <div>
    khekheli Technologies Inc, All rights reserved &copy; {new Date().getFullYear()}.
  </div>
</footer>

<style lang="scss">
  footer {
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
    padding: var(--gap-md);
    flex-shrink: 0;
    gap: var(--gap-md);
    color: inherit;
    color: currentColor;
    border-top: 0.01rem solid var(--gray-500);
    view-transition-name: footer;
  }

  ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-sm);
  }

  li {
    list-style: none;
  }

  ul li a {
    color: currentColor;
    border-color: currentColor;
  }
</style>
