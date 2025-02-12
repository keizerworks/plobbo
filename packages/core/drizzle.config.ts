import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "../../apps/workers/src/**/*.sql.ts",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_DEFAULT_ACCOUNT_ID!,
    databaseId: process.env.D1_DATABASE_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
  casing: "snake_case",
  tablesFilter: ["/^(?!.*_cf_KV).*$/"],
});
