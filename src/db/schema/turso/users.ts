import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().unique(),
  ref_id: text("ref_id").notNull().default(""),
  region: text("region").notNull().default(""),
  city: text("city").notNull().default(""),
  country: text("country").notNull().default("gh"),
  mfa: text("mfa").notNull().default(""),
  pincode: text("pincode").notNull().default(""),
});
