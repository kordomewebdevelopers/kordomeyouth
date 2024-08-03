import { earnsByViews } from "$db/queries/earns";
import { getPromotionById } from "$db/queries/promotions";
import { xata_db } from "$db/xata";
import { formNumberField, formStringField } from "$helpers/form";
import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ params, locals }) => {
  if (!locals.authUser) {
    redirect(303, "/auth/signin");
  }

  let promotions = await getPromotionById(params.promotionId);

  return { promotions, ...params };
};

export const actions = {
  approve: async ({ locals, request }) => {
    if (!locals.authUser) {
      redirect(303, "/auth/signin");
    }

    const form = await request.formData();
    const promotionId = formStringField(form, "promotionId");
    const campaignId = formStringField(form, "campaignId");
    const newViews = form.get("newViews");
    const checked = formStringField(form, "checked");
    const views = formNumberField(form, "views");
    const status = formStringField(form, "status");

    if (checked === "no") {
      return fail(400, {
        message: "Kindly check all the boxes",
        state: "error",
      });
    }

    try {
      await xata_db.promotions.update(promotionId, {
        status: "approved",
        views: newViews ? Number(newViews) : views,
        earn: earnsByViews(views, "wa_status"),
      });

      if (status === "submitted") {
        await xata_db.campaigns.update(campaignId, {
          views: { $increment: views },
          submissions: { $decrement: 1 },
        });
      }

      return {
        state: "success",
        message: "Accepted successfully",
        promotionId,
      };
    } catch {
      return fail(400, { message: "Error ocurred", state: "error" });
    }
  },

  reject: async ({ locals, request }) => {
    if (!locals.authUser) {
      redirect(303, "/signin");
    }

    const form = await request.formData();
    const promotionId = formStringField(form, "promotionId");
    const campaignId = formStringField(form, "campaignId");
    const checked = formStringField(form, "checked");
    const status = formStringField(form, "status");

    if (checked === "no") {
      return fail(400, {
        message: "Kindly check all the boxes",
        state: "error",
      });
    }

    try {
      await xata_db.promotions.update(promotionId, {
        status: "rejected",
      });

      if (status === "submitted") {
        await xata_db.campaigns.update(campaignId, {
          submissions: { $decrement: 1 },
        });
      }

      return {
        state: "success",
        message: "Declined successfully",
        promotionId,
      };
    } catch {
      return fail(400, { message: "Error ocurred. Try again", state: "error" });
    }
  },
};
