import { NEON_DB_URL } from "$env/static/private";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export const neon_db = drizzle(neon(NEON_DB_URL));
