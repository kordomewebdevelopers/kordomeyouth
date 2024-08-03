<script>
  import Selector from "$comps/form/selector.svelte";
  import { regions } from "$lib/data/regions";
  import { getCities } from "$lib/site/cities";
  import { campaign } from "$store/campaign";

  let cities = ["all", ...getCities(regions[0])];
  let region = "";
  $campaign.reach = regions[0];
</script>

<fieldset>
  <legend>Set Promotion Reach</legend>

  <div>
    <label for="region">Select region</label>
    <Selector
      open
      items={regions}
      on:pick={(e) => {
        region = e.detail;
        $campaign.reach = region;
        cities = ["all", ...getCities(region)];
      }}
    />
  </div>

  <div>
    <label for="city">Select city </label>
    <Selector
      items={cities}
      on:pick={(e) => {
        const city = e.detail;
        region = region.length ? region : "nationwide";
        $campaign.reach = city === "all" ? region : city;
      }}
    />
  </div>
</fieldset>

<style>
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    margin-top: 2rem;
  }

  legend {
    font-size: 1.7rem;
    font-weight: bolder;
    margin-bottom: 1.5rem;
  }
</style>
