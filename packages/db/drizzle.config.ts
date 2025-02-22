import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  casing: "snake_case",
  out: "./migrations",
  schema: ["../../packages/db/src/**/*.sql.ts"],
  dbCredentials: { url: process.env.DATABASE_URL! },
});
