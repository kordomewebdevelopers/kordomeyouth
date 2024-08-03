<script lang="ts">
  import Cropper from "$comps/form/cropper.svelte";
  import Selector from "$comps/form/selector.svelte";
  import Svg from "$comps/modals/svg.svelte";
  import { uploadIcon } from "$lib/client/icons";
  import { convertToWebp, fileLoader, imageLoader } from "$helpers/image";
  import toast from "svelte-french-toast";
  import { scale } from "svelte/transition";
  import { campaign, type CampaignFormat } from "$store/campaign";
  import Spinner from "$comps/modals/spinner.svelte";

  const formats: CampaignFormat[] = ["wa_status", "banner"];

  let src = "";
  let placeholder = "/images/placeholder.jpg";
  let disabled = false;
  let loading = false;

  $: aspect = $campaign.format === "wa_status" ? 1 / 1 : 16 / 9;

  const uploadImage = async (files: FileList | null) => {
    if (!files) {
      toast.error("No file selected");
      return;
    }

    const [image] = files;

    if (!image.type.includes("image")) {
      toast.error("Not an image file");

      return;
    }

    const uploaded = (await fileLoader(image)) as string;
    const img = (await imageLoader(uploaded)) as ImageBitmap;

    if ($campaign.format === "banner" || img.height > 1000) {
      src = uploaded;
    } else {
      loading = true;
      $campaign.file = await convertToWebp(uploaded, "w");
      loading = false;
    }
  };

  const handleCrop = async (e: CustomEvent) => {
    if (disabled) return;

    const { cropped } = e.detail;

    disabled = true;

    $campaign.file = await convertToWebp(cropped, "w");

    src = "";
    disabled = false;
  };
</script>

<fieldset>
  <legend>Select Campaign Format</legend>

  <Selector
    open
    select={$campaign.format}
    items={formats}
    on:pick={(e) => {
      $campaign.file = "";
      $campaign.format = e.detail;
    }}
  />

  {#key $campaign.format}
    <div class="info" in:scale>
      {#if $campaign.format === "wa_status"}
        <span>
          This type of campaign ad is promoted by affiliates on their whatsapp
          statues.
        </span>
      {/if}

      {#if $campaign.format === "banner"}
        <span>
          This type of campaign ad is displayed on our relevant pages.
        </span>
      {/if}
    </div>
  {/key}

  <div class="uploads">
    <label for="image" class="upload">
      <div>
        <span>
          <Svg ds={uploadIcon} dimension="80" />
        </span>
        <span>upload</span>
      </div>

      <div class="image">
        <img src={$campaign.file || placeholder} alt="" />
        <Spinner {loading} />
      </div>
    </label>
    <input
      type="file"
      name="image"
      id="image"
      accept=".png, .jpg, .jpeg, .webp"
      class="v-hidden"
      on:change={({ currentTarget }) => uploadImage(currentTarget.files)}
    />
  </div>
</fieldset>

{#if src.length}
  <Cropper
    on:close={() => (src = "")}
    {aspect}
    {src}
    on:crop={handleCrop}
    {disabled}
  />
{/if}

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

  .uploads {
    display: flex;
    justify-content: center;
  }

  .uploads .upload {
    outline: var(--outline);
    border-radius: var(--radius-sm);
    opacity: 0.8;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }

  .uploads img {
    width: 12rem;
    aspect-ratio: initial;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  }

  .upload > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--gap-md);
  }

  .upload > .image {
    position: relative;
    padding: 0;
  }

  .info {
    outline: var(--outline);
    color: currentColor;
    background-color: transparent;
    padding: var(--gap-base);
    border-radius: var(--radius-sm);
  }
</style>
