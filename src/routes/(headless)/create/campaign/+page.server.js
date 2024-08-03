import { fail, redirect } from "@sveltejs/kit";
import { getMaxCampaign } from "$store/campaign";
import { MIN_AD_BUDGET } from "$lib/client/constants";
import { xata_db } from "$db/xata";
import { formNumberField, formStringField } from "$helpers/form";

/**
 * @typedef {import("$store/campaign").CampaignFormat} Format
 */

/**@param {string} value */
const validateFormat = (value) => {
  const allowed = ["banner", "video", "wa_status"];

  if (allowed.includes(value)) {
    return /**@type {Format} */ (value);
  } else {
    return undefined;
  }
};

export const load = async ({ locals }) => {
  if (!locals.authUser) {
    redirect(303, "/auth/signin?tab=login");
  }
};

export const actions = {
  publish: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      redirect(303, "/auth/signin");
    }

    const form = await request.formData();
    const format = validateFormat(formStringField(form, "format"));
    const budget = formNumberField(form, "budget");
    const label = formStringField(form, "label");
    const link = formStringField(form, "link");
    const id = formStringField(form, "campaignId");
    const reach = formStringField(form, "reach");

    if (!budget || budget < MIN_AD_BUDGET) {
      return fail(400, {
        message: `Budget is below our minimum cap (GHC ${MIN_AD_BUDGET})`,
        state: "error",
      });
    }

    if (!format) {
      return fail(400, { message: "Invalid campaign format", state: "error" });
    }

    const max = getMaxCampaign(50, format);
    const advertiser_id = authUser.id;
    const created_at = Date.now();

    try {
      await xata_db.campaigns.create({
        id,
        advertiser_id,
        format,
        max,
        reach,
        label,
        link,
        budget,
        created_at,
      });
    } catch {
      return fail(400, { message: "Error creating campaign.", state: "error" });
    }

    return { state: "published", message: "", id };
  },

  update: async ({ request }) => {
    const { file, id } = await request.json();

    if (!file) {
      return fail(400, { message: "", state: "error" });
    }

    try {
      await xata_db.campaigns.update(id, { file });
    } catch {
      return fail(400, { message: "", state: "error" });
    }

    return { message: "", state: "" };
  },

  delete: async ({ request }) => {
    const { id } = await request.json();

    try {
      await xata_db.campaigns.delete(id);
    } catch {
      return fail(400, {
        message: "An Error occurred. Try again",
        state: "error",
      });
    }

    return { state: "success", message: "" };
  },
};
