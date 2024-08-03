import { getCashouts } from "$db/queries/cashouts";
import { cashouts } from "$db/schema/turso/cashouts";
import { turso_db } from "$db/turso";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async ({ locals }) => {
  const { authUser } = locals;

  if (!authUser) {
    redirect(303, "/auth/signin");
  }

  const { id } = authUser;

  const cashouts = await getCashouts({ col: "user_id", value: id });

  //   const ad = await getDisplayAd(user.region, user.city);

  return { cashouts };
};

export const actions = {
  remove: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/auth/signin");
    }

    const form = await request.formData();

    let id = String(form.get("id"));

    try {
      await turso_db.delete(cashouts).where(eq(cashouts.id, id));
    } catch {
      return fail(400, { message: "Error. Try again", state: "error" });
    }

    let message = "Removed successfully.";

    let result = await getCashouts({ col: "user_id", value: authUser.id });

    return { state: "success", message, cashouts: result };
  },

  recashout: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/auth/signin");
    }

    const form = await request.formData();

    let name = String(form.get("name")).trim();
    let account = String(form.get("account")).trim();
    let id = String(form.get("id")).trim();

    let message = "Reorder is successful.";

    if (!account) {
      message = "Account number is empty.";
      return fail(400, { message, state: "error" });
    }

    if (!name) {
      message = "Account name is empty.";
      return fail(400, { message, state: "error" });
    }

    try {
      await turso_db
        .update(cashouts)
        .set({ name, account, status: "queued" })
        .where(eq(cashouts.id, id));
    } catch {
      message = "Error submitting cashout request. Try again";
      return fail(400, { message, state: "error" });
    }

    const result = await getCashouts({ col: "user_id", value: authUser.id });

    return { state: "success", message, cashouts: result };
  },
};
