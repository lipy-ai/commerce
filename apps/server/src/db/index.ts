import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { logger } from "../lib/logger";
import env from "../env";
import { Database } from "./schema";

export const pool = new Pool({ connectionString: env.DATABASE_URL });

const dbDialect = new PostgresDialect({
  pool,
});

export const db = new Kysely<Database>({
  dialect: dbDialect,
});

export async function pingDatabase() {
  try {
    await sql`SELECT 1`.execute(db);
    logger.info("✅ Database is reachable!");
  } catch (err) {
    logger.error("❌ Failed to connect to database:", err);
  }
}
