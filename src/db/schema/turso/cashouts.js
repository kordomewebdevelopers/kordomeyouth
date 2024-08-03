import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cashouts = sqliteTable("cashouts", {
  id: text("id").notNull().primaryKey(),
  date: integer("date").notNull(),
  account: text("account").notNull(),
  user_id: text("user_id").notNull(),
  status: text("status", {
    enum: ["queued", "rejected", "success", "mismatched"],
  })
    .notNull()
    .default("queued"),
  name: text("name").notNull(),
  spend: real("spend").notNull(),
  ref_id: text("ref_id").notNull(),
});
