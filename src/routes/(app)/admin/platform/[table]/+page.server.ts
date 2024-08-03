import { getPlatformRecords } from "$db/d1/platform";
import { transformPlatformRecord } from "$db/d1/platform";
import type { PlatformTable as Table } from "$db/d1/types";

export const load = async ({ params, platform }) => {
  const table = params.table as Table;
  const year = new Date().getFullYear();
  const record = await getPlatformRecords(platform?.env.db, table, year);

  const { total, records } = transformPlatformRecord(record);

  return { records, table, year, total };
};
