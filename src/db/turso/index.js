import { TURSO_DB_AUTH_TOKEN, TURSO_DB_URL } from "$env/static/private";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const turso_db = drizzle(
  createClient({
    url: TURSO_DB_URL,
    authToken: TURSO_DB_AUTH_TOKEN,
  })
);
