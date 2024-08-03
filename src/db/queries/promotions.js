import { xata_db, xata_raw } from "$db/xata";

/**
 * @typedef {import("$db/xata/schema").Promotion} Promotion
 */

/**
 * @param {string} user_id
 * @returns {Promise<Promotion[]>}
 */
export const getPromotions = async (user_id) => {
  try {
    return await xata_db.promotions
      .sort("created_at", "asc")
      .filter({ user_id })
      .getMany({ pagination: { size: 10 } });
  } catch (/** @type {*}*/ error) {
    console.log({ message: error.message });
    return [];
  }
};

/**
 * @param {string} user_id
 * @returns {Promise<number>}
 */
export const getPromotionCount = async (user_id) => {
  try {
    const records = await xata_db.promotions.filter({ user_id }).summarize({
      summaries: {
        total: { count: "*" },
      },
    });

    return records.summaries[0].total;
  } catch (/** @type {*}*/ error) {
    console.log({ message: error.message });
    return 0;
  }
};

/**
 * @param {string} id
 * @returns {Promise<Promotion[]>}
 */
export const getPromotionById = async (id) => {
  try {
    const { records } = await xata_raw.sql`SELECT
        id, views, status, file, campaign_id, metadata
        FROM promotions
        WHERE id = ${id}
        AND status in ('declined', 'accepted', 'submitted')
        LIMIT 1
        `;

    return records;
  } catch {
    return [];
  }
};

/**
 * @param {string} campaign_id
 * @returns {Promise<Promotion[]>}
 */
export const getPromotionsByCampaign = async (campaign_id) => {
  try {
    return await xata_db.promotions
      .sort("created_at", "asc")
      .filter({ campaign_id, status: "submitted" })
      .getMany();
  } catch {
    return [];
  }
};

/**
 * @returns {Promise<Promotion[]>}
 */
export const getPromotionsAtAdmin = async () => {
  try {
    const { records } = await xata_raw.sql`SELECT
        id, status, created_at
        FROM promotions
        WHERE status in ('declined', 'accepted')
        OR (created_at <= NOW() - INTERVAL '1 days' AND status = 'submitted')
        ORDER BY created_at ASC
        LIMIT 20
        `;

    return records;
  } catch {
    return [];
  }
};
