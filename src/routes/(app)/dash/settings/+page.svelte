<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import Logout from "$comps/buttons/logout.svelte";
  import Slider from "$comps/modals/slider.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import { chevronRightIcon } from "$lib/client/icons";
  import { deleteIcon, lockIcon } from "$lib/client/icons";
  import toast from "svelte-french-toast";
  import Theme from "$comps/buttons/theme.svelte";
  import Selector from "$comps/form/selector.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import { regions } from "$lib/data/regions";
  import { getCities } from "$lib/site/cities";
  import Input from "$comps/form/input.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import Settings from "$comps/ui/settings.svelte";
  import Callout from "$comps/modals/callout.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import ResendEmail from "$comps/form/resendEmail.svelte";

  export let form;
  export let data;

  let { email, name, phone, city, region } = data.user;
  let { searchParams, pathname } = $page.url;
  let id = searchParams.get("open") || "";
  let title = searchParams.get("title") || "";
  let loading = false;
  let account = { id, value: "", title };
  let address = { region, city };
  let verified = data.authUser?.verified;
  let cities = [...new Set([city, ...getCities(region)])];

  $: value = `${region} &ndash; ${city}`;

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      if (form?.state === "error") {
        toast.error(form.message);
      }

      if (form?.state === "success") {
        toast.success(form.message);
        account = { id: "", value: "", title: "" };

        phone = form.phone || phone;
        name = form.name || name;
        city = form.city || city;
        region = form.region || region;
        address = { city, region };
      }

      if (form?.to) {
        goto(form.to, { invalidateAll: true });
      }

      loading = false;
    };
  };

  const close = () => {
    account = { id: "", value: "", title: "" };
    goto(pathname);
    id = "";
    title = "";
  };

  const open = (id: string) => {
    let value = "";
    let title = `Change your ${id}`;
    title = id === "resend" ? "Resend email verification" : title;

    value = id === "email" ? email : value;
    value = id === "name" ? name : value;
    value = id === "phone" ? phone : value;

    account = { id, value, title };
  };
</script>

<section class="vertical">
  <div>
    <h3>Personal</h3>

    {#if !verified}
      <ResendEmail button on:click={() => open("resend")} />
    {/if}
  </div>

  <div class="settings">
    <Settings value={name} on:click={() => open("name")} />
    <Settings {verified} value={email} on:click={() => open("email")} />
    <Settings value={phone} on:click={() => open("phone")} />
    <Settings {value} on:click={() => open("address")} cap />
  </div>
</section>

<section class="vertical">
  <div>
    <h3>Auth & Security</h3>

    <div class="buttons">
      <a href="/dash/settings/auth?tab=password" class="button">
        <span>Change Password</span>

        <div class="icons">
          <span class="icon verified">
            <Svg ds={lockIcon} dimension="20" />
          </span>

          <Svg ds={chevronRightIcon} />
        </div>
      </a>

      <!-- <a href="/dash/settings/auth?tab=pincode" class="button">
        <span>PIN Code</span>
        <div class="icons">
          <span class="icon" class:verified={pincode}>
            <Svg ds={pincode ? lockIcon : dangerIcon} dimension="20" />
          </span>

          <Svg ds={chevronRightIcon} />
        </div>
      </a> -->

      <!-- <a href="/dash/settings/auth?tab=2fa auth" class="button">
        <span>2FA Authentication</span>

        <div class="icons">
          <span class="icon" class:verified={!!mfa}>
            <Svg ds={mfa ? lockIcon : dangerIcon} dimension="20" />
          </span>

          <Svg ds={chevronRightIcon} />
        </div>
      </a> -->

      <Logout />
    </div>
  </div>
</section>

<section class="vertical">
  <div>
    <h3>Appearance</h3>

    <div class="buttons">
      <Theme />
    </div>
  </div>
</section>

<section class="vertical">
  <div>
    <h3>Danger Zone</h3>

    <div class="buttons">
      <button>
        <span>delete account</span>

        <div class="icons">
          <span>
            <Svg ds={deleteIcon} dimension="20" />
          </span>
          <Svg ds={chevronRightIcon} />
        </div>
      </button>
    </div>
  </div>
</section>

{#if account.id}
  {@const { id, value, title } = account}
  <Slider {title} on:click={close}>
    <form method="POST" action="?/{id}" use:enhance={submit}>
      {#if id === "name"}
        <Input type="text" id="name">Enter your new name</Input>
        <input type="hidden" name="previous" {value} />
      {/if}

      {#if id === "address"}
        {@const items = [
          ...new Set(regions.map((r) => (r === "nationwide" ? region : r))),
        ]}
        <div>
          <label for="name">Select your region</label>
          <Selector
            open
            {items}
            on:pick={(e) => {
              address.region = e.detail;
              cities = [...getCities(address.region)];
              address.city = cities[0];
            }}
          />
        </div>

        <div>
          <label for="name">Select a city nearby</label>
          <Selector
            select={address.city}
            items={cities}
            on:pick={(e) => (address.city = e.detail)}
          />
        </div>

        <input type="hidden" name="city" value={address.city} />
        <input type="hidden" name="region" value={address.region} />

        <input type="hidden" name="previousRegion" value={region} />
        <input type="hidden" name="previousCity" value={city} />
      {/if}

      {#if id === "email"}
        <Callout>
          After changing your email, you'll be logged out and use the new email
          to login after you have confirmed.
        </Callout>
        <Input type="email">Enter your new email</Input>
        <input type="hidden" name="previous" {value} />
      {/if}

      {#if id === "phone"}
        <Input type="tel" id="phone">Enter your new phone number</Input>
        <input type="hidden" name="previous" {value} />
      {/if}

      {#if id === "resend"}
        <button formaction="?/resend" style="margin: 0;">
          <Spinner {loading} />
          <span>resend email verification</span>
        </button>
      {:else}
        <button>
          <Spinner {loading} />
          <span>update</span>
        </button>
      {/if}
    </form>
  </Slider>
{/if}

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }

  .buttons button,
  .buttons .button {
    justify-content: space-between;
    background-color: transparent;
    color: currentColor;
    text-transform: initial;
    padding-inline: var(--gap-base) var(--gap-micro);
  }

  .icons {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);

    & span {
      color: var(--red-200);
    }

    & span.verified {
      color: var(--prim-color);
    }
  }

  section + section {
    margin-top: 2rem;
  }

  form {
    padding: 2rem var(--gap-base);
    gap: 2rem;
  }

  form > button {
    margin-top: 2.5rem;
    width: 100%;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
</style>
