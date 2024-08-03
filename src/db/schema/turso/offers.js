import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const offers = sqliteTable("offers", {
  id: text("id").notNull().primaryKey(),
  date: integer("date").notNull(),
  receiver: text("receiver").notNull(),
  user_id: text("user_id").notNull(),
  status: text("status", {
    enum: ["pending", "queued", "rejected", "success", "mismatched"],
  })
    .notNull()
    .default("pending"),
  pack: text("pack").notNull(),
  network: text("network").notNull(),
  amount: text("amount").notNull(),
  transact_id: text("transact_id").notNull(),
});
