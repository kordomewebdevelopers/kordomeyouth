import { fail, redirect } from "@sveltejs/kit";
import { logout } from "$lib/server/auth";

export const actions = {
  updatePassword: async ({ request, locals, cookies }) => {
    const { pb } = locals;

    const form = await request.formData();
    const oldPassword = String(form.get("oldPassword")).trim();
    const password = String(form.get("password"));
    const { id } = locals.user;

    if (!oldPassword || !password) {
      return fail(400, {
        message: "Passwords cannot be empty",
        state: "error",
      });
    }

    if (oldPassword === password) {
      return fail(400, { message: "Passwords are same", state: "error" });
    }

    try {
      const data = { password, passwordConfirm: password, oldPassword };
      await pb.collection("users").update(id, data);
      logout(pb, cookies);

      redirect(303, "/auth/signin?tag=login");
    } catch {
      return fail(500, {
        message: "Password change is denied",
        state: "error",
      });
    }

    return { message: "Success.", state: "success" };
  },
};
