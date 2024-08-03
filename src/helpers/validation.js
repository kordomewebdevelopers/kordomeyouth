/**
 * @param {string} text
 * @param {"email" | "name"} type
 */
export const validateText = (text, type) => {
  const emailRegexp = new RegExp("[^@]+@[^.]+..+", "i");
  const nameRegexp = /^[a-zA-Z -]+$/;

  const regex = type === "email" ? emailRegexp : nameRegexp;

  return regex.test(text);
};

/**
 * @param {string} value
 */
export const validateUrl = (value) => {
  try {
    value = value.startsWith("http") ? value : `http://${value}`;
    const { origin } = new URL(value);
    return { href: origin, valid: true };
  } catch (err) {
    return { href: "", valid: false };
  }
};
