import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { logger } from "../lib/logger";
import { createSchemaFactory } from "drizzle-zod";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import {
  authAccount,
  authUser,
  authVerification,
  orgInvitation,
  orgList,
  orgMember,
  userAddress,
} from "./schema";
import { Kyselify } from "drizzle-orm/kysely";
import env from "../env";

export const pool = new Pool({ connectionString: env.DATABASE_URL });

const dbDialect = new PostgresDialect({
  pool,
});

export const db = new Kysely<Database>({
  // dialect: new PostgresDialect({
  //   pool: new Pool(),
  // }),
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

const { createInsertSchema, createSelectSchema, createUpdateSchema } =
  createSchemaFactory({
    coerce: {
      date: true,
    },
  });

const createValidationSchema = <T extends PgTableWithColumns<any>>(
  dbSchema: T
) => {
  return {
    select: createSelectSchema(dbSchema),
    insert: createInsertSchema(dbSchema),
    update: createUpdateSchema(dbSchema),
  };
};

const tables = {
  "user.address": userAddress,
  "auth.user": authUser,
  "auth.account": authAccount,
  "auth.verification": authVerification,
  "org.list": orgList,
  "org.member": orgMember,
  "org.invitation": orgInvitation,
};

export const validationSchema = {
  userAddress: createValidationSchema(userAddress),
  authUser: createValidationSchema(authUser),
  authAccount: createValidationSchema(authAccount),
  authVerification: createValidationSchema(authVerification),
  orgList: createValidationSchema(orgList),
  orgMember: createValidationSchema(orgMember),
  orgInvitation: createValidationSchema(orgInvitation),
};

export type DBTableMap = typeof tables;

export type DBTypes = {
  [K in keyof DBTableMap]: DBTableMap[K]["$inferSelect"];
};

export type Database = {
  [K in keyof typeof tables]: Kyselify<(typeof tables)[K]>;
};
