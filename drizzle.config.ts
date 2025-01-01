import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/*",
  dialect: "sqlite",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
