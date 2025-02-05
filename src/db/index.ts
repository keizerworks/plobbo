import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "env";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Resource } from "sst/resource";

import type { DB } from "./types";

const globalForDb = globalThis as unknown as {
  dialect: PostgresDialect | undefined;
  pool: Pool | undefined;
};

const pool =
  globalForDb.pool ??
  new Pool({
    host: Resource["plobbo-pg"].host,
    port: Resource["plobbo-pg"].port,
    user: Resource["plobbo-pg"].username,
    password: Resource["plobbo-pg"].password,
    database: Resource["plobbo-pg"].database,
    ssl: false,
  });

if (env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

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

export const drizzleDb = drizzle(pool);
