import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { Resource } from "sst";

export async function handler() {
    const pool = new Pool({
        host: Resource.pg.host,
        port: Resource.pg.port,
        user: Resource.pg.username,
        password: Resource.pg.password,
        database: Resource.pg.database,
    });

    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: "./migrations" });

    return {
        statusCode: 201,
        body: JSON.stringify({ message: "Migration Done" }),
    };
}
