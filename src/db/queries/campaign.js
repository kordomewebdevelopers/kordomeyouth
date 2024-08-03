import { xata_db, xata_raw } from "$db/xata";

const daysToGo = (days = 3) => {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

  return daysAgo;
};

/**
 * @typedef {import("$store/campaign").CampaignFormat} Format
 * @typedef {import("$db/xata/schema").Campaign} Campaign
 */

/**
 * @param {string} status
 * @returns { Promise<Campaign[]>}
 */
export const getAdminCampaigns = async (status) => {
  try {
    if (status === "completed") {
      const { records } = await xata_raw.sql`SELECT *
        FROM campaigns
        WHERE submissions = 0
        AND views >= max
        AND status = 'running'
        LIMIT 20
        `;

      return records;
    } else if (["ended", "rejected"].includes(status)) {
      const res = await xata_db.campaigns
        .filter({ status, "xata.updatedAt": { $le: daysToGo(4) } })
        .getMany({ pagination: { size: 20 } });

      return res;
    } else {
      const res = await xata_db.campaigns
        .sort("created_at", "asc")
        .filter({ status })
        .getMany({ pagination: { size: 20 } });

      return res;
    }
  } catch (error) {
    return [];
  }
};

/**
 * @param {Object} props
 * @param {string} props.region
 * @param {string} props.city
 * @param {Format} props.format
 * @param {string} props.user_id
 * @param {number} [props.limit=30]
 */
export const getRandomCampaigns = async (props) => {
  try {
    const { records } = await xata_raw.sql`SELECT
        id, file, link, label
        FROM campaigns
        WHERE views < max
        AND status = 'running'
        AND NOT advertiser_id = ${props.user_id}
        AND format = ${props.format}
        AND reach IN (${props.city}, ${props.region}, 'nationwide')
        ORDER BY RANDOM()
        LIMIT ${props.limit || 30}
        `;

    return records;
  } catch (/** @type {any}*/ error) {
    console.log({ message: error.message });
    return [];
  }
};

/**
 * @param {string} id
 * @param {number} [size=30]
 * @param {Format} format
 *
 * @returns { Promise<Campaign[]>}
 */
export const getAdvertiserCampaigns = async (id, format, size) => {
  try {
    if (format === "wa_status") {
      const { records } = await xata_raw.sql`SELECT
        id, file, link, label
        FROM campaigns
        WHERE views < max
        AND status = 'running'
        AND advertiser_id = ${id}
        AND format = ${format}
        ORDER BY RANDOM()
        LIMIT ${size || 30}
        `;

      return records;
    } else {
      const res = await xata_db.campaigns
        .filter({ advertiser_id: id })
        .sort("created_at", "desc")
        .getMany({ pagination: { size } });

      return res;
    }
  } catch (/** @type {any}*/ error) {
    console.log({ message: error.message });
    return [];
  }
};

/**
 * @param {string} region
 * @param {string} city
 */
export const getBannerAd = async (region, city) => {
  let campaign = { id: "", file: "/ads/2b75bebc.webp", label: "", link: "" };
  const props = { region, city, user_id: "none", limit: 1 };
  const records = await getRandomCampaigns({ ...props, format: "banner" });

  if (records.length) {
    const record = records[0];

    await xata_db.campaigns.update(record.id, { views: { $increment: 1 } });

    campaign.id = record.id;
    campaign.file = record.file;
    campaign.label = record.label;
    campaign.link = record.link;
  }

  return campaign;
};
