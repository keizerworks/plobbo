import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Resource } from "sst/resource";

import { env } from "~/env";

const globalForDb = globalThis as unknown as {
    pool: Pool | undefined;
};

const pool =
    globalForDb.pool ??
    new Pool({
        host: Resource.pg.host,
        port: Resource.pg.port,
        user: Resource.pg.username,
        password: Resource.pg.password,
        database: Resource.pg.database,
    });

if (env.NODE_ENV !== "production") {
    globalForDb.pool = pool;
}

export const db = drizzle(pool, { casing: "snake_case" });
