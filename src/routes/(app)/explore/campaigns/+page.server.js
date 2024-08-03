import { xata_db } from "$db/xata";
import { fail, redirect } from "@sveltejs/kit";
import { getAdvertiserCampaigns } from "$db/queries/campaign";
import { getRandomCampaigns } from "$db/queries/campaign";
import { getPromotionCount } from "$db/queries/promotions";
import { saveToPlatform } from "$db/d1/platform";
import { dev } from "$app/environment";

/**
 * @typedef {import("$db/xata/schema").Campaign} Campaign
 */

export const load = async ({ locals, url }) => {
  const { authUser, user } = locals;

  let tab = url.searchParams.get("tab") || "others";
  let length = Number(url.searchParams.get("len")) || 0;

  /**
   * @type {Campaign[]}
   */
  let campaigns = [];

  if (authUser) {
    const { region, city } = user;
    const user_id = authUser.id;
    const limit = 30;
    const props = { region, city, user_id, limit };

    length = length ? Number(length) : await getPromotionCount(user_id);

    if (tab === "others") {
      campaigns = await getRandomCampaigns({ ...props, format: "wa_status" });
    }

    tab = campaigns.length === 0 ? "own" : tab;

    if (tab === "own") {
      campaigns = await getAdvertiserCampaigns(user_id, "wa_status", limit);
      console.log({ campaigns: campaigns.length });
    }
  }

  return { campaigns, tab, length };
};

export const actions = {
  promote: async ({ locals, request, platform }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(307, "/auth/signin");
    }

    console.log({ verified: authUser.verified });

    if (!authUser.verified) {
      return fail(400, {
        message:
          "Email is not verified. Kindly verify your email before doing this.",
        state: "error",
      });
    }

    const form = await request.formData();
    const campaign_id = String(form.get("campaign_id"));
    const campaign_file = String(form.get("campaign_file"));
    const id = String(form.get("promotionId"));
    let length = Number(form.get("length"));

    if (length >= 10) {
      return fail(400, {
        message: "You can only have 10 promotions in every 24hrs.",
        state: "error",
      });
    }

    try {
      const result = await xata_db.campaigns
        .select(["max", "views", "status"])
        .filter({ id: campaign_id })
        .getFirst();

      if (!result) {
        return fail(400, {
          message: "Campaign does not exist",
          state: "error",
        });
      }

      const { views, max, status } = result;

      if (views > max || status !== "running") {
        return fail(400, {
          message: "Max promotions reached for this campaign",
          state: "error",
        });
      }

      const [user_id, created_at] = [authUser.id, new Date()];

      await xata_db.promotions.create({
        id,
        campaign_id,
        user_id,
        created_at,
        campaign_file,
      });

      await xata_db.campaigns.update(campaign_id, {
        promotions: { $increment: 1 },
      });

      if (!dev) {
        await saveToPlatform(platform?.env.db, "promotions", 1);
      }

      length = length + 1;
      return {
        length,
        state: "success",
        message: `Successful. You have ${
          10 - length
        } more promotion spots for the day.`,
      };
    } catch {
      return fail(400, { message: "Error ocurred. Try again", state: "error" });
    }
  },
};
