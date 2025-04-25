import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { logger } from "../lib/logger";
import env from "../env";
import { dbTables } from "./schema";
import { Kyselify } from "drizzle-orm/kysely";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

export const pool = new Pool({ connectionString: env.DATABASE_URL });

const dbDialect = new PostgresDialect({
  pool,
});

const dbClient = new Kysely<Database>({
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

export const db = dbClient.withSchema("lipy");

function createTableMap<T extends Record<string, PgTableWithColumns<any>>>(
  schemas: T
): { [K in keyof T as `${T[K]["_"]["name"] & string}`]: T[K] } {
  const result = {} as {
    [K in keyof T as `${T[K]["_"]["name"] & string}`]: T[K];
  };

  for (const key in schemas) {
    const table = schemas[key];
    if (!table || !table["_"]) break;
    const k =
      `${table["_"]["name"]}` as `${(typeof table)["_"]["name"] & string}`;
    console.log(key, k, table["_"]["name"]);
    result[k] && table && Object.assign(result[k], table);
  }

  return result;
}

const tables = createTableMap(dbTables);

export type DBTableMap = typeof tables;

export type DBTypes = {
  [K in keyof DBTableMap]: DBTableMap[K]["$inferSelect"];
};

export type Database = {
  [K in keyof typeof tables]: Kyselify<(typeof tables)[K]>;
};
