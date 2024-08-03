import { genUsername } from "$helpers/uuid";
import { validateText } from "$helpers/validation";
import { login, logout } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (locals.authUser) {
    redirect(303, "/");
  }
};

export const actions = {
  signup: async ({ request, locals }) => {
    const { pb } = locals;

    const form = await request.formData();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password"));
    const ref_id = String(form.get("ref_id"));
    const username = genUsername(email);

    if (!validateText(email, "email") || !password) {
      return fail(406, {
        message: "Invalid email or password.",
        state: "error",
      });
    }

    try {
      const passwordConfirm = password;
      const options = { email, password, username, passwordConfirm, name: "" };

      await pb.collection("users").create({ ...options });
      await pb.collection("users").requestVerification(email);
      await pb.collection("users").authWithPassword(email, password);
    } catch (/** @type {*}*/ error) {
      const message =
        error.data?.data?.email?.message || "Server error. Try again later.";

      return fail(500, { message, state: "error" });
    }

    return {
      message: `Success`,
      state: "success",
      to: `/auth/onboard?ref_id${ref_id}`,
    };
  },

  login: async ({ request, locals, cookies }) => {
    const { pb } = locals;

    const form = await request.formData();

    const email = String(form.get("email") || "").trim();
    let password = String(form.get("password"));

    if (!validateText(email, "email") || !password) {
      return fail(406, {
        message: "Invalid email or password.",
        state: "error",
      });
    }

    const { result, message } = await login(pb, cookies, email, password);

    if (result === "error") {
      return fail(500, { message, state: "error" });
    }

    return { message, state: "success", to: "/" };
  },

  logout: async ({ locals, cookies }) => {
    const { pb } = locals;

    const { state, message } = logout(pb, cookies);

    if (state === "error") {
      return fail(500, { message, state });
    }

    redirect(303, "/");
  },
};
