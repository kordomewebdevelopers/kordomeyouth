import { APP_ENCRYPT_KEY } from "$env/static/private";
import { APP_ENCRYPT_IV } from "$env/static/private";
import * as devalue from "devalue";
import aes from "crypto-js/aes";
import mode from "crypto-js/mode-ecb";
import padding from "crypto-js/pad-pkcs7";
import Utf8 from "crypto-js/enc-utf8";

/**
 * @template Generic
 * @param {Generic} data
 */
export const encrypt = (data) => {
  const key = Utf8.parse(APP_ENCRYPT_KEY);
  const iv = Utf8.parse(APP_ENCRYPT_IV);
  const text = devalue.stringify(data);
  const encrypted = aes.encrypt(text, key, { iv, mode, padding });

  return encrypted.toString();
};

/**
 * @template Generic
 * @param {string} cipher
 * @returns {Generic}
 */
export const decrypt = (cipher) => {
  const key = Utf8.parse(APP_ENCRYPT_KEY);
  const iv = Utf8.parse(APP_ENCRYPT_IV);
  const decrypted = aes.decrypt(cipher, key, { iv, mode, padding });

  return devalue.parse(decrypted.toString(Utf8));
};
