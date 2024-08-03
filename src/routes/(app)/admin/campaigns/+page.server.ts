import { getAdminCampaigns } from "$db/queries/campaign";
import { xata_db } from "$db/xata";
import { formStringField } from "$helpers/form";
import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
  const { authUser } = locals;

  if (!authUser) {
    redirect(303, "/admin");
  }

  const tab = url.searchParams.get("tab") || "pending";

  const campaigns = await getAdminCampaigns(tab);

  return { campaigns, tab };
};

export const actions = {
  regulate: async ({ locals, request, platform }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/admin");
    }

    const form = await request.formData();
    let status = formStringField(form, "status");
    let campaignId = formStringField(form, "campaignId");

    try {
      await xata_db.campaigns.update(campaignId, {
        status,
      });

      // if (status === "running") {
      //   await saveToPlatform(platform?.env.DB, "campaigns", 1);
      // }

      return {
        state: "success",
        message: `Successfully ${status}`,
        campaignId,
      };
    } catch (error: any) {
      return fail(400, {
        message: "An error occurred. Please try again.",
        state: "error",
      });
    }
  },

  remove: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/admin");
    }

    const form = await request.formData();
    const deletedId = formStringField(form, "campaignId");

    try {
      await xata_db.campaigns.delete(deletedId);

      return { state: "success", message: "removed", deletedId };
    } catch (error: any) {
      return fail(400, { message: "Could not delete", state: "error" });
    }
  },
};
