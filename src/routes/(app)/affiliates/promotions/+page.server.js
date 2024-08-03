import { xata_db } from "$db/xata";
import { fail, redirect } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";
import { REFERRAL_PERCENT } from "$lib/client/constants";
import { getPromotions } from "$db/queries/promotions";
import { turso_db } from "$db/turso";
import { wallets } from "$db/schema/neon/wallet";

/**
 * @typedef {import("$db/xata/schema").Promotion} Promotion
 */

export const load = async ({ locals }) => {
  const { authUser } = locals;

  /**
   * @type {Promotion[]}
   */
  let promotions = [];

  if (authUser) {
    const { id } = authUser;
    promotions = await getPromotions(id);
  }

  return { promotions };
};

export const actions = {
  remove: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(307, "/auth/signin");
    }

    const form = await request.formData();
    const deletedId = String(form.get("promotionId") || "");
    const action = String(form.get("action") || "");

    if (!deletedId) {
      fail(400, { message: "Error ocurred. Try again", state: "error" });
    }

    try {
      await xata_db.promotions.delete(deletedId);

      return {
        state: "success",
        message: "Promotion removed successfully",
        deletedId,
        action,
      };
    } catch {
      return fail(400, { message: "Error ocurred. Try again", state: "error" });
    }
  },

  reward: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(307, "/auth/signin");
    }

    const form = await request.formData();
    const deletedId = String(form.get("promotionId"));
    const earned = Number(form.get("earned"));
    const ref_id = String(form.get("ref_id"));

    try {
      await turso_db
        .update(wallets)
        .set({
          affiliate: sql`${wallets.affiliate} + ${earned}`,
        })
        .where(eq(wallets.id, authUser.id));

      await xata_db.promotions.delete(deletedId);

      if (ref_id || ref_id !== "null") {
        const x = (earned * REFERRAL_PERCENT.affiliate) / 100;

        await turso_db
          .update(wallets)
          .set({ referral: sql`${wallets.referral} + ${x}` })
          .where(eq(wallets.id, ref_id));
      }

      return { state: "success", message: "Successful", deletedId };
    } catch {
      return fail(400, { message: "Error ocurred. Try again", state: "error" });
    }
  },

  feedback: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      throw redirect(307, "/auth/signin");
    }

    let { file, id, views, campaign_id, metadata } = await request.json();

    views = Number(views);

    if (!file) {
      return fail(400, { message: "", state: "error" });
    }

    if (isNaN(views)) {
      return fail(400, { message: "", state: "error" });
    }

    try {
      await xata_db.promotions.update(id, {
        status: "submitted",
        file,
        views,
        metadata,
      });

      await xata_db.campaigns.update(campaign_id, {
        submissions: { $increment: 1 },
      });

      return { state: "", message: "" };
    } catch {
      return fail(400, { message: "", state: "" });
    }
  },

  submit: async () => {
    return { state: "feedback", message: "" };
  },
};
