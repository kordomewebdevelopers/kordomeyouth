import { integer, numeric, pgTable, text } from "drizzle-orm/pg-core";

export const wallets = pgTable("wallets", {
  id: text("id").notNull().primaryKey(),
  affiliate: numeric("affiliate", { precision: 8, scale: 4 })
    .notNull()
    .default("0.0000"),
  shop: numeric("shop", { precision: 10, scale: 4 })
    .notNull()
    .default("0.0000"),
  wallet: numeric("wallet", { precision: 10, scale: 4 })
    .notNull()
    .default("0.0000"),
  referral: numeric("referral", { precision: 8, scale: 5 })
    .notNull()
    .default("0.00000"),
  invites: integer("invites").default(0).notNull(),
  month: integer("month").default(0).notNull(),
  count: integer("count").default(0).notNull(),
});
