<script lang="ts">
  import Slider from "$comps/modals/slider.svelte";
  import Spinner from "$comps/modals/spinner.svelte";
  import Cropper from "cropperjs";
  import "cropperjs/dist/cropper.min.css";
  import { createEventDispatcher } from "svelte";

  export let src = "";
  export let aspect = 3 / 4;
  export let disabled = false;

  let cropper: Cropper;

  const dispatch = createEventDispatcher();

  const load = (image: HTMLImageElement) => {
    if (cropper !== undefined) {
      cropper.destroy();
    }

    cropper = new Cropper(image, {
      aspectRatio: aspect,
      dragMode: "crop",
      scalable: false,
      zoomOnTouch: false,
      zoomOnWheel: false,
      zoomable: false,
      cropBoxResizable: false,
      minCropBoxWidth: image.width,
      minCropBoxHeight: image.height,
      viewMode: 2,
      background: false,
      toggleDragModeOnDblclick: false,
      autoCropArea: 1,
    });
  };

  const close = () => {
    cropper.destroy();

    dispatch("close");
  };

  const handelCrop = () => {
    const cropped = cropper.getCroppedCanvas().toDataURL();

    cropper.destroy();

    dispatch("crop", { cropped });
  };
</script>

<Slider on:click={close}>
  <div class="wrapper">
    <div class="img">
      <img {src} alt="" use:load />
    </div>

    <div class="flow-wide">
      <button type="button" on:click={close} class="button-shadow">
        cancel
      </button>

      <button type="button" on:click={handelCrop} {disabled}>
        <Spinner loading={disabled} />
        <span>crop image</span>
      </button>
    </div>
  </div>
</Slider>

<style>
  .flow-wide {
    padding: var(--gap-sm);
  }

  .img {
    height: 35rem;
    background-color: var(--green-050);
  }
</style>
