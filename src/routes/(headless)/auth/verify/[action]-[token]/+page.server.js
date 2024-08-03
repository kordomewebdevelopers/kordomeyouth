import { users } from "$db/schema/turso/users";
import { turso_db } from "$db/turso";
import { validateText } from "$helpers/validation";
import { findUser, userToCookie } from "$lib/server/user";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async ({ params, locals }) => {
  const { token, action } = params;

  let result = "auto";

  if (action === "emailVerification") {
    try {
      await locals.pb.collection("users").confirmVerification(token);
      result = "success";
    } catch {
      result = "error";
    }
  }

  return { result, action, token };
};

export const actions = {
  resend: async ({ locals }) => {
    const { authUser, pb } = locals;

    if (!authUser) {
      redirect(303, "/auth/signin");
    }

    const { email } = authUser;

    try {
      await pb.collection("users").requestVerification(email);
    } catch {
      return fail(500, { message: "Failed to resend email", state: "error" });
    }

    return {
      message: `Email verification sent successfully`,
      state: "success",
    };
  },

  passwordReset: async ({ locals, request }) => {
    const { pb } = locals;

    const form = await request.formData();

    const token = String(form.get("token") || "");
    const password = String(form.get("password") || "");
    const passwordConfirm = password;

    try {
      await pb
        .collection("users")
        .confirmPasswordReset(token, password, passwordConfirm);
    } catch {
      return fail(500, { message: "Failed to reset password", state: "error" });
    }

    return {
      message: "Successful. Redirecting...",
      state: "success",
      to: "/auth/signin",
    };
  },

  emailChange: async ({ locals, request, cookies }) => {
    const { pb } = locals;

    const form = await request.formData();
    const token = String(form.get("token") || "");
    const password = String(form.get("password") || "");
    const email = String(form.get("email") || "");

    if (!password) {
      return fail(406, { message: "Enter your password", state: "error" });
    }

    if (!validateText(email, "email")) {
      return fail(406, { message: "Invalid email.", state: "error" });
    }

    const already = await findUser("", email);

    if (already?.email) {
      return fail(500, {
        message: "The email is already in use",
        state: "error",
      });
    }

    try {
      await pb.collection("users").confirmEmailChange(token, password);
      const { record } = await pb
        .collection("users")
        .authWithPassword(email, password);

      const records = await turso_db
        .update(users)
        .set({ email })
        .where(eq(users.id, record.id))
        .returning();

      const user = records[0];

      userToCookie(cookies, user);
    } catch {
      return fail(500, {
        message: "Failed to change email address",
        state: "error",
      });
    }

    return { message: "Successful. Redirecting...", state: "success", to: "/" };
  },
};
