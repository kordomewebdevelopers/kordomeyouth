/**
 * @param {string} text
 */
export const slugify = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9- ]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 15);
};

/**
 * @param {string} text
 */
export const cleanText = (text) => {
  return text.trim().replace(/[`=+*$~%[<>){}@#(]/g, "");
};

/**
 * @param {string} url
 */
export const getIdFromYTurl = (url) => {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;

  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  return "";
};
