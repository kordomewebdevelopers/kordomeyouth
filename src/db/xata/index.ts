import { XATA_API_KEY as apiKey } from "$env/static/private";
import { XataClient } from "$db/xata/init";

export const xata_db = new XataClient({ apiKey, branch: "main" }).db;
export const xata_raw = new XataClient({ apiKey, branch: "main" });
