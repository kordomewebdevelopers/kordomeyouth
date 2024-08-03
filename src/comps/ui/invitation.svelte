<script>
  import { page } from "$app/stores";
  import Copy from "$comps/buttons/copy.svelte";
  import Callout from "$comps/modals/callout.svelte";
  import { getRefLink } from "$helpers/formats";

  export let invites = 0;

  let link = getRefLink($page.data.user.id, $page.url.origin);
</script>

<div class="wrap">
  <Callout>
    Invite your friends and enjoy a lifetime of 0.15% on their affiliate
    earnings and 0.35% when they create a campaign. Copy your invitation link
    below and share with friends. You have invited
    <span class="highlight">{invites} friend(s)</span> so far.
  </Callout>

  <Copy data={link} />
</div>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    padding: 0;
  }
</style>
