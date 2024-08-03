/**
 * @param {number[]} array
 */
const mapToString = (array) => {
  return array.map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * @param {string} cred
 * @param {Uint8Array} [salt]
 */
export const hashCred = async (cred, salt) => {
  const encoder = new TextEncoder();

  salt = salt || crypto.getRandomValues(new Uint8Array(16));

  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(cred),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const exported = await crypto.subtle.exportKey("raw", key);
  const buffer = new Uint8Array(exported);
  const hashArray = Array.from(buffer);
  const hashHex = mapToString(hashArray);
  const saltHex = mapToString(Array.from(salt));

  return `${saltHex}:${hashHex}`;
};

/**
 * @param {string} hash
 * @param {string} cred
 */
export async function verifyCred(hash, cred) {
  const [saltHex, originalHash] = hash.split(":");
  const matchResult = saltHex.match(/.{1,2}/g);

  if (!matchResult) {
    throw new Error("Invalid salt format");
  }

  const salt = new Uint8Array(matchResult.map((byte) => parseInt(byte, 16)));
  const attemptHashWithSalt = await hashCred(cred, salt);
  const [_, attemptHash] = attemptHashWithSalt.split(":");
  return attemptHash === originalHash;
}
