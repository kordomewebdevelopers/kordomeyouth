/**
 * @param {File} file
 */
export const fileLoader = (file) => {
  return new Promise((resolve) => {
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = ({ target }) => {
      resolve(target?.result);
    };
  });
};

/**
 * @param {string} src
 */
export let imageLoader = (src) => {
  const img = document.createElement("img");
  img.src = src;

  return new Promise((resolve) => {
    img.onload = ({ target }) => {
      resolve(target);
    };
  });
};

/**
 * @param {string} src
 * @param {("w" | "j")} ext
 */
export const convertToWebp = async (src, ext) => {
  const target = await imageLoader(src);

  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  canvas.width = target.width;
  canvas.height = target.height;
  ctx?.drawImage(target, 0, 0, canvas.width, canvas.height);

  const type = ext === "w" ? "image/webp" : "image/jpeg";

  return canvas.toDataURL(type, 0.5);
};

/**
 * @param {string} src
 */
export const toBlob = async (src) => {
  return await fetch(src).then((res) => res.blob());
};

/**
 * @param {Blob} blob
 */
export const blobToDataURL = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (_e) => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

/**
 * @param {number} width
 */
const getFit = (width) => {
  let offsetHeight = 100;
  let fontSize = 5;

  if (width > 1080) {
    offsetHeight = 120;
    fontSize = 7;
  }

  if (width > 1280) {
    offsetHeight = 180;
    fontSize = 10;
  }

  return { offsetHeight, fontSize };
};

/**
 * @param {string} src
 * @param {string} text
 * @param {("w" | "j")} ext
 */
export const watermark = async (src, text, ext) => {
  const blob = await toBlob(src);

  const image = await createImageBitmap(blob);

  const canvas = document.createElement("canvas");

  canvas.width = image.width;
  const { offsetHeight, fontSize } = getFit(canvas.width);

  canvas.height = image.height + offsetHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    return "";
  }

  const textHeight = offsetHeight / 2;

  context.drawImage(canvas, 0, 0);
  context.fillStyle = "#02bb6e";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#343a40";
  context.textBaseline = "middle";
  context.font = `normal ${fontSize}rem Poppins`;
  context.fillText(text, 60, canvas.height - textHeight);

  context.drawImage(image, 0, 0);

  const type = ext === "w" ? "image/webp" : "image/jpeg";

  return canvas.toDataURL(type, 0.5);
};
