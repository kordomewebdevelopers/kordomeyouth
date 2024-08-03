import type { Config } from "drizzle-kit";
import { TURSO_DB_AUTH_TOKEN, TURSO_DB_URL } from "../cred/turso";

export default {
  schema: "./src/db/schema/turso/*",
  driver: "turso",
  dialect: "sqlite",
  dbCredentials: {
    url: TURSO_DB_URL,
    authToken: TURSO_DB_AUTH_TOKEN,
  },
} satisfies Config;
