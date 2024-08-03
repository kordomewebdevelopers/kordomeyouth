import { dev } from "$app/environment";
import { decrypt, encrypt } from "./encryption";
import { ONE_WEEK_IN_SECONDS } from "$lib/client/constants";
import * as devalue from "devalue";

/**
 * @typedef {import("@sveltejs/kit").Cookies} Cookies
 */

/**
 * @param {string} name
 * @param {Cookies} cookies
 */
export const deleteCookie = (name, cookies) => {
  cookies.set(name, "", {
    path: "/",
    maxAge: 0,
    secure: !dev,
  });
};

/**
 * @template generic
 * @param {generic} data
 * @param {string} name
 * @param {Cookies} cookies
 */
export const saveToCookie = (cookies, name, data) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + ONE_WEEK_IN_SECONDS);

  cookies.set(name, encrypt(data), {
    path: "/",
    maxAge: ONE_WEEK_IN_SECONDS,
    expires: date,
    secure: !dev,
  });
};

/**
 * @template generic
 * @param {string} name
 * @param {Cookies} cookies
 * @returns {generic | undefined}
 */
export const getFromCookie = (name, cookies) => {
  const data = cookies.get(name);

  return data ? decrypt(data) : undefined;
};

/**
 * @template generic
 * @param {generic} data
 * @param {string} name
 * @param {Cookies} cookies
 */
export const saveRawToCookie = (cookies, name, data) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + ONE_WEEK_IN_SECONDS);

  cookies.set(name, devalue.stringify(data), {
    path: "/",
    maxAge: ONE_WEEK_IN_SECONDS,
    expires: date,
    secure: !dev,
  });
};

/**
 * @template generic
 * @param {string} name
 * @param {Cookies} cookies
 * @returns {generic | undefined}
 */
export const getRawFromCookie = (name, cookies) => {
  const data = cookies.get(name);

  return data ? devalue.parse(data) : undefined;
};
