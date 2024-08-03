import { offers } from "$db/schema/turso/offers";
import { turso_db } from "$db/turso";
import { asc, desc, eq, inArray } from "drizzle-orm";

/** @typedef {import('$types/orders').Order} Order*/

/**
 * @param {string} id
 * @returns {Promise<Order[]>}
 */
export const getUserOrders = async (id) => {
  try {
    const results = await turso_db
      .select()
      .from(offers)
      .where(eq(offers.user_id, id))
      .orderBy(desc(offers.date))
      .limit(10);

    return results;
  } catch {
    return [];
  }
};

/**
 * @returns {Promise<Order[]>}
 */
export const getAdminOrders = async () => {
  try {
    const results = await turso_db
      .select()
      .from(offers)
      .where(inArray(offers.status, ["pending", "queued"]))
      .orderBy(asc(offers.date))
      .limit(20);

    return results;
  } catch {
    return [];
  }
};
