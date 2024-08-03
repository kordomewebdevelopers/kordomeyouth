<script>
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { fetcher } from "$helpers/fetcher";
  import { cookieNotice } from "$store/theme";
  import Slider from "./slider.svelte";

  const handle = async (href = "") => {
    await fetcher("/api/cookies", "POST");
    $cookieNotice = "true";
    if (href) {
      goto(href, { invalidateAll: true });
    }
  };
</script>

<Slider title="Cookie Notice" on:click={() => handle()}>
  {@const href = "/policies/cookies"}
  <div class="wrapper">
    This website uses technologies such as cookies to enable essential site
    functionalities, as well as for analytics, and personalization purposes. To
    learn more, visit the following link:
    <a {href} on:click|preventDefault={() => handle(href)}>Cookie Policy</a>

    <form
      class="inline"
      method="POST"
      action="/api/cookies"
      use:enhance={() => {
        $cookieNotice = "true";
      }}
    >
      <button>okay</button>
    </form>
  </div>
</Slider>

<style>
  .wrapper {
    padding: var(--gap-sm);
    position: relative;
  }

  form {
    position: absolute;
    top: -3.3rem;
    right: 1.5rem;
    width: 6rem;
    z-index: 90;
  }

  button {
    padding-block: var(--gap-micro);
  }
</style>
