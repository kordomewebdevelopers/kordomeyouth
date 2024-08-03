/**
 * @template Type
 * @param {Type[]} array
 */
export const shuffle = (array) => {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
};

/**
 * @template Type
 * @param {Type[]} array
 * @param {Type} data
 */
export const filter = (array, data) => {
  return array.filter((item) => JSON.stringify(item) !== JSON.stringify(data));
};

/**
 * @template Type
 * @param {Type[]} items
 */
export const randomItem = (items) => {
  let pos = Math.floor(Math.random() * items.length);

  return items[pos];
};

/**
 * @param {number} min
 * @param {number} max
 */
export const numberRange = (min, max) => {
  return [...Array(max - min + 1).keys()].map((i) => i + min);
};

/**
 * @template Type
 * @param {Type[]} first
 * @param {Type[]} second
 */
export const equalArrays = (first, second) => {
  const [setA, setB] = [new Set(first), new Set(second)];

  return (
    first.length === second.length &&
    [...setA].every((value) => setB.has(value))
  );
};

/**
 * @param {string} text
 */
export const wordCount = (text) => {
  const words = text.match(/\S+/g);
  return words ? words.length : 0;
};
