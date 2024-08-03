import { getPromotionsByCampaign } from "$db/queries/promotions";
import { xata_db } from "$db/xata";
import { formNumberField, formStringField } from "$helpers/form";
import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ params, locals }) => {
  if (!locals.authUser) {
    redirect(303, "/auth/signin");
  }

  let promotions = await getPromotionsByCampaign(params.campaignId);

  return { promotions, ...params };
};

export const actions = {
  accept: async ({ locals, request }) => {
    if (!locals.authUser) {
      redirect(303, "/signin");
    }

    const form = await request.formData();
    const promotionId = formStringField(form, "promotionId");
    const campaignId = formStringField(form, "campaignId");
    const newViews = form.get("newViews");
    const checked = formStringField(form, "checked");
    const views = formNumberField(form, "views");

    if (checked === "no") {
      return fail(400, {
        message: "Kindly check all the boxes",
        state: "error",
      });
    }

    try {
      await xata_db.promotions.update(promotionId, {
        status: "accepted",
        views: newViews ? Number(newViews) : views,
      });

      await xata_db.campaigns.update(campaignId, {
        views: { $increment: views },
        submissions: { $decrement: 1 },
      });

      return {
        state: "success",
        message: "Accepted successfully",
        promotionId,
      };
    } catch {
      return fail(400, { message: "Error ocurred", state: "error" });
    }
  },

  decline: async ({ locals, request }) => {
    if (!locals.authUser) {
      redirect(303, "/signin");
    }

    const form = await request.formData();
    const promotionId = formStringField(form, "promotionId");
    const campaignId = formStringField(form, "campaignId");
    const checked = formStringField(form, "checked");

    if (checked === "no") {
      return fail(400, {
        message: "Kindly check all the boxes",
        state: "error",
      });
    }

    try {
      await xata_db.promotions.update(promotionId, {
        status: "declined",
      });

      await xata_db.campaigns.update(campaignId, {
        submissions: { $decrement: 1 },
      });

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
