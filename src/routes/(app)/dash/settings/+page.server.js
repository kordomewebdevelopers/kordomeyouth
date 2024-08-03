import { fail, redirect } from "@sveltejs/kit";
import { validateText } from "$helpers/validation";
import { userToCookie } from "$lib/server/user";
import { eq } from "drizzle-orm";
import { turso_db } from "$db/turso";
import { users } from "$db/schema/turso/users";
import { logout } from "$lib/server/auth";

export const actions = {
  email: async ({ request, locals, cookies }) => {
    const { authUser, pb } = locals;

    if (!authUser) {
      redirect(303, "/auth/signin");
    }

    const form = await request.formData();

    const email = String(form.get("email")).trim();
    const previous = String(form.get("previous"));

    if (email === previous) {
      return fail(400, { message: "No changes made.", state: "error" });
    }

    if (!validateText(email, "email")) {
      return fail(400, { message: "Invalid email", state: "error" });
    }

    try {
      await pb.collection("users").requestEmailChange(email);
      logout(pb, cookies);
    } catch {
      return fail(400, { message: "Failed to change email", state: "error" });
    }

    return {
      message: `Email verification sent to ${email}`,
      state: "success",
      to: "/",
    };
  },

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
      message: "Email verification sent successfully",
      state: "success",
    };
  },

  name: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/auth/signin");
    }

    const name = String(form.get("name")).trim();
    const previous = String(form.get("previous"));

    if (!name || !validateText(name, "name")) {
      return fail(400, { message: "Invalid name.", state: "error" });
    }

    if (name.toLowerCase() === previous.toLowerCase()) {
      return fail(400, { message: "No changes made.", state: "error" });
    }

    const { id } = authUser;

    try {
      await turso_db.update(users).set({ name }).where(eq(users.id, id));
    } catch {
      return fail(500, { message: "Failed to update record", state: "error" });
    }

    userToCookie(cookies, { ...locals.user, name });

    return { message: "Success.", state: "success", name };
  },

  phone: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/login");
    }

    const phone = String(form.get("phone")).trim();
    const previous = String(form.get("previous"));

    if (phone.length !== 10) {
      return fail(400, { message: "Invalid phone.", state: "error" });
    }

    if (phone === previous) {
      return fail(400, { message: "No changes made.", state: "error" });
    }

    const { id } = authUser;

    try {
      await turso_db.update(users).set({ phone }).where(eq(users.id, id));
    } catch {
      return fail(500, { message: "Failed to update record", state: "error" });
    }

    userToCookie(cookies, { ...locals.user, phone });

    return { message: "Success.", state: "success", phone };
  },

  address: async ({ request, locals, cookies }) => {
    const form = await request.formData();

    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/login");
    }

    const city = String(form.get("city")).trim();
    const region = String(form.get("region")).trim();
    const previousCity = String(form.get("previousCity"));
    const previousRegion = String(form.get("previousRegion"));

    if (previousCity === city && previousRegion === region) {
      return fail(400, { message: "No changes made.", state: "error" });
    }

    const { id } = authUser;

    try {
      await turso_db
        .update(users)
        .set({ region, city })
        .where(eq(users.id, id));
    } catch {
      return fail(500, { message: "Failed to update record", state: "error" });
    }

    userToCookie(cookies, { ...locals.user, city, region });

    return { message: "Success", state: "success", city, region };
  },
};
