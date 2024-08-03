/** @param {number} number */
export const abbrevNum = (number) => {
  return Intl.NumberFormat("en", { notation: "compact" }).format(number);
};

/** @param {number} [max] */
export const randomInt = (max) => {
  return Math.floor(Math.random() * (max || Date.now()));
};

/**
 * @param {number} min
 * @param {number} max
 */
export const numberRange = (min, max) => {
  return [...Array(max - min + 1).keys()].map((i) => i + min);
};

/**
 * @param {number} n
 * @param {number} m
 */
export const modulo = (n, m) => {
  return ((n % m) + m) % m;
};

/**
 * @param {number} a
 * @param {number} b
 */
export const adder = (a, b) => {
  return a + b;
};

/**
 * @param {number} a
 * @param {number} b
 */
export const factor = (a, b) => {
  return a * b;
};
