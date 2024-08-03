import { uuidv7 } from "uuidv7";

const getUUID = () => {
  return uuidv7().replaceAll("-", "").slice(0, 26);
};

/**
 * @param {Object} [options]
 * @param {string} [options.id='']
 * @param {number} [options.length=36]
 */
export const uuid = (options) => {
  let result = getUUID();

  let id = options?.id || "";
  const len = options?.length || 26;

  if (id.length) {
    id = id.replaceAll("-", "");
    const supplied = id.slice(0, 13);
    const offset = 13 - supplied.length;
    result = `${result.slice(0, 13 + offset)}${supplied}`;
  }

  return result.slice(0, len);
};

/**
 * @param {string} email
 */
export const genUsername = (email) => {
  const name = email.slice(0, email.indexOf("@")).replaceAll("www.", "");
  const id = getUUID();

  return `${name.slice(0, 10)}_${id.slice(0, 10)}`;
};
