import PocketBase from "pocketbase";
import { findUser, userToCookie, visitor } from "./user";

/**
 * @typedef {import("@sveltejs/kit").Cookies} Cookies
 */

/**
 * @param {PocketBase} pb
 * @param {string} email
 * @param {string} password
 */
export const verifyPassword = async (pb, email, password) => {
  try {
    await pb.collection("users").authWithPassword(email, password);

    return { message: "Password verified", valid: true };
  } catch (/** @type {*} */ e) {
    console.log({ message: e.message });
    return { message: "Invalid password", valid: false };
  }
};

/**
 * @param {PocketBase} pb
 * @param {Cookies} cookies
 */
export const logout = (pb, cookies) => {
  try {
    pb.authStore.clear();
    userToCookie(cookies, visitor);
    return { message: "Successfully logged out", state: "success" };
  } catch {
    return { message: "Error. Try again later.", state: "error" };
  }
};

/**
 * @param {PocketBase} pb
 * @param {Cookies} cookies
 * @param {string} email
 * @param {string} password
 */
export const login = async (pb, cookies, email, password) => {
  try {
    const { record } = await pb
      .collection("users")
      .authWithPassword(email, password);

    const user = await findUser(record.id, email);

    userToCookie(cookies, user);
    return { message: "Signed in successfully", result: "success" };
  } catch (/** @type {*}*/ error) {
    const message = error.message.includes("Failed to auth")
      ? "Invalid login credentials"
      : "Server error. Try again later.";
    return { result: "error", message };
  }
};
