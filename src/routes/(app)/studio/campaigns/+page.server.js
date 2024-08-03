import { getAdvertiserCampaigns } from "$db/queries/campaign";
import { xata_db } from "$db/xata";
import { fail, redirect } from "@sveltejs/kit";

/**
 * @typedef {import("$db/xata/schema").Campaign} Campaign
 */

export const load = async ({ locals }) => {
  const { authUser } = locals;

  /**
   * @type {Campaign[]}
   */
  let campaigns = [];

  if (authUser) {
    campaigns = await getAdvertiserCampaigns(authUser.id, "banner", 50);
  }

  return { campaigns, title: "ad studio" };
};

export const actions = {
  regulate: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/auth/signin");
    }

    const form = await request.formData();

    let status = String(form.get("status"));
    let id = String(form.get("campaignId"));

    try {
      /** @type {Campaign|null}*/
      const campaign = await xata_db.campaigns.update(id, {
        status,
      });

      return { state: "success", message: "Successful", campaign };
    } catch (/** @type {*}*/ error) {
      return fail(400, {
        message: "An error occurred. Please try again.",
        state: "error",
      });
    }
  },

  remove: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/auth/signin");
    }

    const form = await request.formData();

    let removedId = String(form.get("campaignId"));

    try {
      await xata_db.campaigns.delete(removedId);

      return { state: "success", message: "Removed", removedId };
    } catch {
      return fail(400, {
        message: "Could not remove campaign",
        state: "error",
      });
    }
  },
};
