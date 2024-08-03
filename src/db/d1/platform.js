import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

/** @typedef {import('./types').PlatformTable} Table */
/** @typedef {import('./types').PlatformRecord} Record */

/** @param {Table} table */
export const getPlatformTable = (table) => {
  return sqliteTable(table, {
    year: integer("year").notNull().primaryKey(),
    january: integer("january").notNull().default(0),
    february: integer("february").notNull().default(0),
    march: integer("march").notNull().default(0),
    april: integer("april").notNull().default(0),
    may: integer("may").notNull().default(0),
    june: integer("june").notNull().default(0),
    july: integer("july").notNull().default(0),
    august: integer("august").notNull().default(0),
    september: integer("september").notNull().default(0),
    october: integer("october").notNull().default(0),
    november: integer("november").notNull().default(0),
    december: integer("december").notNull().default(0),
  });
};

/**
 * @param {number} month
 * @returns {("january" | "february" | "march" | "april" | "may" | "june" | "july" | "august" | "september" | "october" | "november" | "december")}
 */
export const getPlatformCol = (month) => {
  switch (month) {
    case 0:
      return "january";

    case 1:
      return "february";

    case 2:
      return "march";

    case 3:
      return "april";

    case 4:
      return "may";

    case 5:
      return "june";

    case 6:
      return "july";

    case 7:
      return "august";

    case 8:
      return "september";

    case 9:
      return "october";

    case 10:
      return "november";

    default:
      return "december";
  }
};

/** @param {*} D1 */
export const getD1DB = (D1) => {
  return drizzle(D1);
};

/**
 * @param {*} d1
 * @param {Table} table
 * @param {number} year
 */
export const getPlatformRecords = async (d1, table, year) => {
  const db = getD1DB(d1);
  const platform = getPlatformTable(table);
  const select = {
    january: platform.january,
    february: platform.february,
    march: platform.march,
    april: platform.april,
    may: platform.may,
    june: platform.june,
    july: platform.july,
    august: platform.august,
    september: platform.september,
    october: platform.october,
    november: platform.november,
    december: platform.december,
  };

  try {
    const result = await db
      .select(select)
      .from(platform)
      .where(eq(platform.year, year));

    return result[0];
  } catch {
    return {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    };
  }
};

/**
 * @param {*} d1
 * @param {Table} table
 * @param {number} value
 */
export const saveToPlatform = async (d1, table, value) => {
  const date = new Date();

  const year = date.getFullYear();
  const col = getPlatformCol(date.getMonth());
  const platform = getPlatformTable(table);
  const db = getD1DB(d1);

  await db
    .insert(platform)
    .values({ year, [col]: value })
    .onConflictDoUpdate({
      target: platform.year,
      set: {
        [col]: sql`${platform[col]} + ${value}`,
      },
    });
};

/**
 * @param {Record} record
 */
export const transformPlatformRecord = (record) => {
  const total = Object.values(record).reduce((prev, acc) => {
    return prev + acc;
  }, 0);

  const records = Array.from(Object.entries(record), ([title, value]) => {
    return { title, value };
  });

  return { total, records };
};
