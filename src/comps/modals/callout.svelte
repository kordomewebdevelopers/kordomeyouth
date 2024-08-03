<script>
  export let info = false;
  export let success = false;
  export let danger = false;
  export let warn = false;
</script>

<div class="callout" class:info class:success class:danger class:warn>
  <p><slot /></p>
</div>

<style>
  .callout {
    padding: var(--gap-base);
    border-radius: var(--radius-sm);
    display: flex;
    flex-direction: column;
    gap: var(--gap-base);
    outline: var(--outline);
  }

  .callout.info {
    outline-color: var(--info-color);
    color: var(--info-color);
  }

  .callout.danger {
    outline-color: var(--danger-color);
    color: var(--danger-color);
  }

  .callout.warn {
    outline-color: var(--warn-color);
    color: var(--warn-color);
  }

  .callout.success {
    outline-color: var(--success-color);
    color: var(--success-color);
  }

  p {
    font-size: var(--font-base);
  }

  :global(.callout a) {
    color: currentColor;
    text-decoration: underline;
  }
</style>
