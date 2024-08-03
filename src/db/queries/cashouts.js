import { cashouts } from "$db/schema/turso/cashouts";
import { turso_db } from "$db/turso";
import { asc, desc, eq } from "drizzle-orm";

/**
 * @param {{ col: "user_id" | "status", value: string }} param
 * @param {boolean} [ascend=false]
 * @param {number} [size=10]
 */
export const getCashouts = async (param, ascend, size) => {
  const { col, value } = param;

  try {
    const results = await turso_db
      .select()
      .from(cashouts)
      .where(eq(cashouts[col], value))
      .orderBy(ascend ? asc(cashouts.date) : desc(cashouts.date))
      .limit(size || 10);

    return results;
  } catch (error) {
    return [];
  }
};
