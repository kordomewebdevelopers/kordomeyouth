import { neon_db } from "$db/neon";
import { wallets } from "$db/schema/neon/wallet";
import { users } from "$db/schema/turso/users";
import { turso_db } from "$db/turso";
import { validateText } from "$helpers/validation";
import { existing_users_emails } from "$lib/server/existing";
import { updateRecID } from "$lib/server/migrate";
import { findUser, userToCookie } from "$lib/server/user";
import { fail, redirect } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";

export const load = async ({ locals, cookies }) => {
  const { authUser } = locals;

  if (authUser && existing_users_emails.includes(authUser.email)) {
    const { id, email } = authUser;

    const user = await findUser("", email);

    if (user.id) {
      await updateRecID(user.id, id);
      userToCookie(cookies, user);

      redirect(303, "/");
    }
  }
};

export const actions = {
  default: async ({ locals, request, cookies }) => {
    const { authUser } = locals;

    if (!authUser) {
      return { message: "/auth/signin?tab=login", state: "success" };
    }

    const form = await request.formData();

    let name = String(form.get("name")).trim();
    let phone = String(form.get("phone")).trim().replaceAll(" ", "");
    let region = String(form.get("region"));
    let city = String(form.get("city"));
    let ref_id = String(form.get("ref")).trim();

    if (!name || !validateText(name, "name")) {
      return fail(400, { message: "Name is empty.", state: "error" });
    }

    if (region === "select") {
      return fail(400, { message: "Select a region", state: "error" });
    }

    if (city === "select") {
      return fail(400, { message: "Select a city near you", state: "error" });
    }

    if (phone.length !== 10) {
      return fail(400, { message: "Invalid phone number.", state: "error" });
    }

    const { id, email } = authUser;

    try {
      const user = { name, email, id, phone, ref_id, region, city };

      Promise.all([
        await turso_db.insert(users).values(user),
        await neon_db.insert(wallets).values({ id }),
      ]);

      userToCookie(cookies, { ...user, pincode: "", mfa: "", country: "" });
      locals.user = { ...user, pincode: "", mfa: "", country: "" };
    } catch {
      return fail(400, { message: "Error creating user", state: "error" });
    }

    if (ref_id) {
      await neon_db
        .update(wallets)
        .set({ invites: sql`${wallets.invites} + 1` })
        .where(eq(wallets.id, ref_id));
    }

    return {
      message: `Success. Welcome to khekheli`,
      state: "success",
      to: "/",
    };
  },
};
