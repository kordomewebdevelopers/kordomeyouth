<script lang="ts">
  import Selector from "$comps/form/selector.svelte";
  import { actionLabels, links } from "$lib/data/titles";
  import { filter } from "$helpers/arrays";
  import { campaign } from "$store/campaign";
  import Callout from "$comps/modals/callout.svelte";

  let inputEle: HTMLInputElement;

  const labels = filter(actionLabels, "none");
  const titles = links.map((l) => l.text);

  $campaign.label = actionLabels[0];

  let link = links[0];

  const format = (detail = "") => {
    link = links.find((l) => l.text === detail) || links[0];
    $campaign.link = "";
    inputEle.value = "";
    inputEle.focus();
  };

  const load = (node: HTMLInputElement) => {
    inputEle = node;
  };
</script>

<fieldset>
  <legend>Add Link for Call-to-Action</legend>

  <Callout>
    A button to redirect when your campaign is clicked. This is optional.
  </Callout>

  <Selector items={titles} on:pick={(e) => format(e.detail)} open />

  <div>
    <label for="holder">Enter a link (eg, {link.placeholder})</label>
    <input
      type={link.type}
      name="holder"
      id="holder"
      placeholder={link.placeholder}
      use:load
      on:input={({ currentTarget: { value } }) => {
        $campaign.link = `${link.protocol}${value}`;
      }}
    />
  </div>

  <div>
    <label for="label">select action label</label>
    <Selector items={labels} on:pick={(e) => ($campaign.label = e.detail)} />
  </div>
</fieldset>

<style>
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  legend {
    font-size: 1.7rem;
    font-weight: bolder;
    margin-bottom: 1.5rem;
  }

  input {
    width: 18.5rem;
  }
</style>
