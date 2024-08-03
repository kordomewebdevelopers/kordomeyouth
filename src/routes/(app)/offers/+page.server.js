import { dev } from "$app/environment";
import { neon_db } from "$db/neon";
import { getDefaultEarn } from "$db/queries/earns";
import { wallets } from "$db/schema/neon/wallet";
import { offers } from "$db/schema/turso/offers";
import { turso_db } from "$db/turso";
import { uuid } from "$helpers/uuid";
import { LOCK_OFFER } from "$lib/server/settings";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async ({ locals }) => {
  const { authUser } = locals;

  let wallet = 0;

  if (authUser) {
    wallet = await getDefaultEarn(authUser.id);
  }

  return { wallet };
};

export const actions = {
  buy_data: async ({ request, locals }) => {
    const form = await request.formData();
    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/auth/signin");
    }

    let message = "Your order is placed successfully";

    if (!dev && LOCK_OFFER) {
      message = "Making order is temporally on hold.";
      return fail(400, { message, state: "error" });
    }

    let pack = String(form.get("pack"));
    const amount = String(form.get("amount"));
    const receiver = String(form.get("receiver"));
    const network = String(form.get("network"));

    if (!receiver) {
      message = "Please enter receiver number";
      return fail(400, { message, state: "error" });
    }

    if (amount.startsWith("0")) {
      message = "Amount must not start with zero";
      return fail(400, { message, state: "error" });
    }

    try {
      const user_id = authUser.id;
      const id = uuid({ length: 18, id: user_id });

      const earns = await getDefaultEarn(user_id);
      const balance = earns - Number(amount);

      if (balance < 0) {
        message =
          "Amount to spend is higher than amount in your default wallet";
        return fail(400, { message, state: "error" });
      }

      pack =
        pack === "evd"
          ? `${amount} ${pack}`
          : `${pack.slice(0, pack.indexOf("GB"))} GB`;

      await neon_db
        .update(wallets)
        .set({ affiliate: `${balance}` })
        .where(eq(wallets.id, user_id));

      await turso_db.insert(offers).values({
        id,
        pack,
        receiver,
        amount,
        status: "pending",
        date: Date.now(),
        network,
        transact_id: id,
        user_id,
      });

      return { message, state: "success.created", balance };
    } catch {
      message = "Error placing order. Please contact support on Whatsapp";
      return fail(400, { message, state: "error" });
    }
  },
};
