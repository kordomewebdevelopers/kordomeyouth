import { fail, redirect } from "@sveltejs/kit";
import { CASHOUT_LEVY_PERCENT, CASHOUT_CAP } from "$lib/client/constants";
import { MAX_CASHOUT } from "$lib/client/constants";
import { LOCK_CASHOUT } from "$lib/server/settings";
import { eq } from "drizzle-orm";
import { earnByPercent, getEarns } from "$db/queries/earns";
import { spendOnPercent } from "$db/queries/earns";
import { cashoutRateLimit } from "$db/queries/earns";
import { uuid } from "$helpers/uuid";
import { turso_db } from "$db/turso";
import { cashouts } from "$db/schema/turso/cashouts";
import { neon_db } from "$db/neon";
import { wallets } from "$db/schema/neon/wallet";

export const load = async ({ locals }) => {
  const { authUser } = locals;

  if (!authUser) {
    redirect(303, "/signin");
  }

  const earns = await getEarns(authUser.id);

  return { earns, title: "wallet" };
};

export const actions = {
  cashout: async ({ locals, request }) => {
    const { authUser } = locals;

    if (!authUser) {
      throw redirect(303, "/auth/signin");
    }

    const form = await request.formData();

    let name = String(form.get("name") || "");
    let account = String(form.get("account") || "");
    let ref_id = String(form.get("ref_id") || "");
    let spend = Number(form.get("spend") || 0);

    let message = "Successful. Visit cashouts page to track.";

    if (LOCK_CASHOUT) {
      message = "Making cashout order is temporally on hold.";
      return fail(400, { message, state: "error" });
    }

    if (![1, 2, 3].includes(new Date().getDay())) {
      message = "Cashout period is over (from Monday to Wednesday).";
      return fail(400, { message, state: "error" });
    }

    let currentMonth = new Date().getMonth();

    if (!account) {
      return fail(400, { message: "Account number is empty.", state: "error" });
    }

    if (!name) {
      return fail(400, { message: "Account name is empty.", state: "error" });
    }

    const { min, max } = CASHOUT_CAP;

    if (!spend || spend < CASHOUT_CAP.min) {
      message = `Amount spending is less than minimum (${min})`;
      return fail(400, { message, state: "error" });
    }

    if (spend > CASHOUT_CAP.max) {
      message = `Amount spending is greater than maximum (${max})`;
      return fail(400, { message, state: "error" });
    }

    const uid = authUser.id;
    let { month, count } = await cashoutRateLimit(uid);

    if (month === currentMonth && count >= MAX_CASHOUT) {
      message = "Maximum cashout limit reached for this month.";
      return fail(400, { message, state: "error" });
    }

    let { affiliate, referral } = await getEarns(uid);

    let total = affiliate + referral;

    if (total < spend) {
      message = `Amount spending (GHC ${spend}) is bigger than your earnings`;
      return fail(400, { message, state: "error" });
    }

    affiliate = earnByPercent(affiliate, total, spend);
    referral = earnByPercent(referral, total, spend);
    spend = spendOnPercent(CASHOUT_LEVY_PERCENT, spend);

    count = count === MAX_CASHOUT ? 1 : count + 1;

    try {
      const wallet = {
        affiliate: String(affiliate),
        referral: String(referral),
        month,
        count,
      };

      const cashout = {
        id: uuid(),
        user_id: uid,
        spend,
        account,
        date: Date.now(),
        name,
        ref_id,
      };

      await Promise.all([
        turso_db.insert(cashouts).values(cashout),
        neon_db.update(wallets).set(wallet).where(eq(wallets.id, uid)),
      ]);
    } catch (_) {
      message = "Error submitting cashout request. Try again";
      return fail(400, { message, state: "error" });
    }

    return { state: "success", message, affiliate, referral, count };
  },
};
