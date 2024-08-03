/**
 * @param {FormData} form
 * @param {string} field
 */
export const formStringField = (form, field) => {
  const value = form.get(field)?.toString().trim();

  return value || "";
};

/**
 * @param {FormData} form
 * @param {string} field
 */
export const formNumberField = (form, field) => {
  const value = form.get(field)?.toString().trim();

  return Number(value || 0);
};
