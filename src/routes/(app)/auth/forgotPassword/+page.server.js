import { validateText } from "$helpers/validation";
import { logout } from "$lib/server/auth";
import { fail } from "@sveltejs/kit";

export async function load({ locals, cookies }) {
  logout(locals.pb, cookies);
}

export const actions = {
  updatePassword: async ({ request, locals }) => {
    const { pb } = locals;

    const form = await request.formData();
    const email = String(form.get("email"));

    if (!validateText(email, "email")) {
      return fail(400, { message: "Invalid email", state: "error" });
    }

    try {
      await pb.collection("users").requestPasswordReset(email);
      return { state: "success", message: "Success. Email sent", email };
    } catch {
      return fail(500, { message: "An error occurred", state: "error" });
    }
  },
};
