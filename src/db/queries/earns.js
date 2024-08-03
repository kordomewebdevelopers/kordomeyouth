import { neon_db } from "$db/neon";
import { wallets } from "$db/schema/neon/wallet";
import { CAMPAIGN_PERCENT_REWARD } from "$lib/client/constants";
import { CAMPAIGN_PER_VIEW } from "$lib/client/constants";
import { eq } from "drizzle-orm";

/**
 * @param {string} id
 */
export const getEarns = async (id) => {
  try {
    const results = await neon_db
      .select()
      .from(wallets)
      .where(eq(wallets.id, id));

    const result = results[0];

    const affiliate = parseFloat(result.affiliate);
    const wallet = parseFloat(result.wallet);
    const referral = parseFloat(result.referral);
    const shop = parseFloat(result.shop);

    return { ...result, affiliate, referral, shop, wallet };
  } catch (_) {
    return {
      affiliate: 0.0,
      referral: 0.0,
      invites: 0,
      count: 0,
      shop: 0.0,
      wallet: 0.0,
    };
  }
};

/**
 * @param {string} id
 */
export const getDefaultEarn = async (id) => {
  try {
    const result = await neon_db
      .select({
        affiliate: wallets.affiliate,
      })
      .from(wallets)
      .where(eq(wallets.id, id));

    return parseFloat(result[0].affiliate);
  } catch (error) {
    return 0;
  }
};

/**
 * @param {number} earn - The current earning
 * @param {number} total - The total earning
 * @param {number} spend - The spending amount
 */
export const earnByPercent = (earn, total, spend) => {
  const percent = (earn / total) * spend;

  return Math.round(earn - percent);
};

/**
 * @param {string} id - user Id
 */
export const cashoutRateLimit = async (id) => {
  const cashout = { month: 0, count: 0 };

  try {
    const result = await neon_db
      .select({
        month: wallets.month,
        count: wallets.count,
      })
      .from(wallets)
      .where(eq(wallets.id, id));

    return result[0] || cashout;
  } catch (error) {
    return cashout;
  }
};

/**
 * @param {number} views
 * @param {("wa_status" | "video")} format
 */
export const earnsByViews = (views, format) => {
  const earned =
    views * CAMPAIGN_PER_VIEW[format] * CAMPAIGN_PERCENT_REWARD[format];

  return Number(earned.toFixed(2));
};

/**
 * @param {number} percent
 * @param {number} spend - The spending amount
 * @returns {number}
 */
export const spendOnPercent = (percent, spend) => {
  return spend - Math.ceil((spend * percent) / 100);
};
