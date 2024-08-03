<script>
  import { CAMPAIGN_PER_VIEW, MIN_AD_BUDGET } from "$lib/client/constants";
  import { formatCurrency } from "$helpers/formats";
  import { campaign, getMaxCampaign } from "$store/campaign";
  import Callout from "$comps/modals/callout.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import { equalIcon } from "$lib/client/icons";

  $campaign.budget = MIN_AD_BUDGET;

  $campaign.max = getMaxCampaign($campaign.budget, $campaign.format);

  const handleInput = (value = "") => {
    $campaign.budget = Number(value.replaceAll(",", ""));

    $campaign.max = getMaxCampaign($campaign.budget, $campaign.format);
  };

  const check = () => {
    const { budget } = $campaign;
    $campaign.budget = budget < MIN_AD_BUDGET ? MIN_AD_BUDGET : budget;
  };
</script>

<fieldset>
  <legend>Add Your Budget</legend>
  <Callout>
    After campaigns are submitted, they're reviewed and approved before payments
    can be made.
  </Callout>

  <div>
    <label for="budget">Enter your budget in GHC</label>
    <input
      type="tel"
      name="budget"
      id="budget"
      value={formatCurrency($campaign.budget)}
      on:input={({ currentTarget: { value } }) => handleInput(value)}
      on:change={check}
    />
  </div>

  <div>
    <label for="max">Minimum views</label>
    <input type="text" name="max" id="max" readonly value={$campaign.max} />
  </div>

  <Callout>
    <span class="flow-wide">
      <span>CAMPAIGN PER VIEW</span>
      <Svg ds={equalIcon} />
      <span>GHC {CAMPAIGN_PER_VIEW[$campaign.format]}</span>
    </span>
  </Callout>
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

  div + div {
    margin: 1.5rem 0;
  }
</style>
