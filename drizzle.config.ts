import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
    dialect: "postgresql",
    casing: "snake_case",
    out: "./migrations",
    schema: ["./src/db/**/*.sql.ts"],
    dbCredentials: {
        host:
            Resource.App.stage === "production"
                ? Resource.pg.host
                : "localhost",
        database:
            Resource.App.stage === "production"
                ? Resource.pg.database
                : "plobbo",
        password:
            Resource.App.stage === "production"
                ? Resource.pg.password
                : "password",
        user:
            Resource.App.stage === "production"
                ? Resource.pg.username
                : "postgres",
        port: Resource.App.stage === "production" ? Resource.pg.port : 5432,
        ssl: false,
    },
});
