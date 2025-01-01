import { DB_FILE_NAME } from "astro:env/server";

import "dotenv/config";

import { drizzle } from "drizzle-orm/libsql";

// You can specify any property from the libsql connection options
export const db = drizzle({
  connection: { url: DB_FILE_NAME },
  casing: "snake_case",
});
