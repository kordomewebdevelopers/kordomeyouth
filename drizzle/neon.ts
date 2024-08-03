import type { Config } from "drizzle-kit";
import { NEON_DB_URL } from "../cred/neon";

export default {
  schema: "./src/db/schema/neon/*",
  dialect: "postgresql",
  dbCredentials: {
    url: NEON_DB_URL,
  },
} satisfies Config;
