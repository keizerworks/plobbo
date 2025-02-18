import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  casing: "snake_case",
  out: "./migrations",
  schema: ["../../packages/db/src/**/*.sql.ts"],
  dbCredentials: {
    host: "localhost",
    database: "plobbo",
    password: "password",
    user: "postgres",
    port: 5432,
    ssl: false,
  },
});
