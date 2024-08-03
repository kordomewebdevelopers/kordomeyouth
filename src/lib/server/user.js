import { getFromCookie, saveToCookie } from "./cookies";
import { turso_db } from "$db/turso";
import { eq, or } from "drizzle-orm";
import { userCookieName } from "$helpers/cookieNames";
import { users } from "$db/schema/turso/users";

/**
 * @typedef {import('$types/user').User} User
 * @typedef {import("@sveltejs/kit").Cookies} Cookies
 */

/** @type {User} */
export const visitor = {
  name: "",
  phone: "",
  id: "",
  email: "",
  ref_id: "",
  city: "",
  region: "",
  country: "",
  mfa: "",
  pincode: "",
};

/**
 * @param {Cookies} cookies
 * @param {User} user
 */
export const userToCookie = (cookies, user) => {
  saveToCookie(cookies, userCookieName(user.id), user);
};

/**
 * @param {string} id
 * @param {string} email
 */
export const findUser = async (id, email) => {
  try {
    const result = await turso_db
      .select()
      .from(users)
      .where(or(eq(users.id, id), eq(users.email, email)));

    return result[0];
  } catch {
    return visitor;
  }
};

/**
 * @param {string} id
 * @param {string} email
 * @param {Cookies} cookies
 */
export const getUser = async (id, email, cookies) => {
  const result = getFromCookie(userCookieName(id), cookies);

  /** @type {User} */
  const user = result ? result : await findUser(id, email);

  if (user.id) {
    userToCookie(cookies, user);
  }

  return user;
};
