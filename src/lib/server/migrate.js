import { neon_db } from "$db/neon";
import { wallets } from "$db/schema/neon/wallet";
import { cashouts } from "$db/schema/turso/cashouts";
import { offers } from "$db/schema/turso/offers";
import { users } from "$db/schema/turso/users";
import { turso_db } from "$db/turso";
import { eq } from "drizzle-orm";

/**
 * @param {string} oldId - The old user id to replace with.
 * @param {string} newId - The new user id replace the oldId.
 */
export const updateRecID = async (oldId, newId) => {
  try {
    await turso_db.update(users).set({ id: newId }).where(eq(users.id, oldId));

    await neon_db
      .update(wallets)
      .set({ id: newId })
      .where(eq(wallets.id, oldId));

    await turso_db
      .update(cashouts)
      .set({ user_id: newId })
      .where(eq(cashouts.user_id, oldId));

    await turso_db
      .update(offers)
      .set({ user_id: newId })
      .where(eq(offers.user_id, oldId));
  } catch (error) {
    // @ts-ignore
    console.log({ message: error.message });
  }
};
