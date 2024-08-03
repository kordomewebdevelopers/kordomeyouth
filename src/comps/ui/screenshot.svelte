<script lang="ts">
  import Cropper from "$comps/form/cropper.svelte";
  import Callout from "$comps/modals/callout.svelte";
  import { convertToWebp, fileLoader } from "$helpers/image";
  import { createEventDispatcher } from "svelte";

  export let id = "";
  export let campaign_file = "";

  let src = "";
  let placeholder = "/images/placeholder.jpg";
  let screenshot = "";
  let aspect = 2 / 1.5;
  let dispatch = createEventDispatcher();

  const uploadImage = async (files: FileList | null) => {
    if (!files) return;

    const [image] = files;

    if (!image.type.includes("image")) return;

    const metadata = {
      path: image.webkitRelativePath,
      filename: image.name,
      modified: image.lastModified,
      size: image.size,
    };

    dispatch("upload", { metadata });

    src = (await fileLoader(image)) as string;
  };

  const handleCrop = async (e: CustomEvent) => {
    const { cropped } = e.detail;

    screenshot = await convertToWebp(cropped, "j");

    dispatch("crop", { file: screenshot });

    src = "";
  };
</script>

<Callout>
  SCREENSHOT ID: <span class="id">{id}</span>
  (Let the number views be shown in the cropped image)
</Callout>

<div class="uploads">
  <label for="image" class="upload">
    <img src={campaign_file || placeholder} alt="" />
    <img src={screenshot || placeholder} alt="" />
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

{#if src.length}
  <Cropper on:close={() => (src = "")} {aspect} {src} on:crop={handleCrop} />
{/if}

<style>
  .uploads {
    display: flex;
    justify-content: center;
  }

  .uploads .upload {
    display: flex;
    align-items: end;
    justify-content: center;
    gap: var(--gap-base);
  }

  .uploads img {
    width: 11rem;
    aspect-ratio: 1/1;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  .id {
    font-size: 1.3rem;
    color: var(--sec-color);
    margin: 0 var(--gap-sml);
  }
</style>
