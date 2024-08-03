import { getUserOrders } from "$db/queries/offers";
import { offers } from "$db/schema/turso/offers";
import { turso_db } from "$db/turso/index";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

/** @typedef {import('$types/orders').Order} Order*/

export const load = async ({ locals }) => {
  const { authUser } = locals;

  /** @type {Order[]} */
  let orders = [];

  if (authUser) {
    orders = await getUserOrders(authUser.id);
  }

  return { orders };
};

export const actions = {
  remove: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/auth/signin");
    }

    const form = await request.formData();
    let orderId = String(form.get("orderId"));
    let message = "Removed successfully.";

    try {
      await turso_db.delete(offers).where(eq(offers.id, orderId));

      return { message, state: "success.removed", orderId };
    } catch {
      message = "Error to delete record. Try again";
      return fail(400, { message, state: "error" });
    }
  },

  change: async ({ request, locals }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/auth/signin");
    }

    const form = await request.formData();

    const orderId = String(form.get("orderId"));
    const receiver = String(form.get("receiver") || "");

    let message = "Successfully change receiver";

    if (!receiver) {
      message = "Kindly enter the receiver number";
      return fail(400, { message, state: "error" });
    }

    try {
      await turso_db
        .update(offers)
        .set({ receiver, status: "pending" })
        .where(eq(offers.id, orderId))
        .returning();

      return { message, state: "success.changed", orderId, receiver };
    } catch {
      message = "Error adding receiver number. Try again";
      return fail(400, { message, state: "error" });
    }
  },
};
