import { formStringField } from "$helpers/form";
import { userToCookie, visitor } from "$lib/server/user";
import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const { pb } = locals;

  if (pb.authStore.isAdmin) {
    redirect(303, "/admin/dash");
  }
};

export const actions = {
  default: async ({ request, locals, cookies }) => {
    const { pb } = locals;

    const form = await request.formData();

    const email = formStringField(form, "email");
    const password = formStringField(form, "password");

    try {
      await pb.admins.authWithPassword(email, password);
    } catch (error) {
      return fail(500, {
        message: "Server error. Try again later.",
        state: "error",
      });
    }

    userToCookie(cookies, { ...visitor, email });

    redirect(303, "/admin/dash");
  },
};
