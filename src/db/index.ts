import { env } from "env";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import type { DB } from "./types";

const globalForDb = globalThis as unknown as {
  dialect: PostgresDialect | undefined;
  pool: Pool | undefined;
};

const pool =
  globalForDb.pool ??
  new Pool({
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    user: env.DB_USERNAME,
    port: env.DB_PORT,
    password: env.DB_PASSWORD,
    max: 10,
  });

const dialect =
  globalForDb.dialect ??
  new PostgresDialect({
    pool,
  });

if (env.NODE_ENV !== "production") {
  globalForDb.dialect = dialect;
}

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({ dialect });
