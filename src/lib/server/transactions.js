import { offers } from "$db/schema/turso/offers";
import { turso_db } from "$db/turso";
import { xata_db } from "$db/xata";
import { eq } from "drizzle-orm";

/**
 * @param {string} resourceId
 * @param {string} resource
 * @param {string} transact_id
 */
export const addAfterPay = async (resourceId, resource, transact_id) => {
  try {
    if (resource === "campaign") {
      await xata_db.campaigns.update(resourceId, {
        transact_id,
        status: "running",
      });
    }

    if (resource === "order") {
      await turso_db
        .update(offers)
        .set({ transact_id })
        .where(eq(offers.id, resourceId));
    }

    return { message: "Completed successfully", state: "success" };
  } catch {
    return { message: "An error occurred. Please try again.", state: "error" };
  }
};
