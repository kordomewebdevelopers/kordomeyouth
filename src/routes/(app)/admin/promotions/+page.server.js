import { getPromotionsAtAdmin } from "$db/queries/promotions";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  if (!locals.authUser) {
    redirect(303, "/auth/signin");
  }

  const promotions = await getPromotionsAtAdmin();

  return { promotions };
};
