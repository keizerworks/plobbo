import { type Config } from "drizzle-kit";
import { env } from "env";

export default {
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    ssl: false,
  },
  tablesFilter: ["renor-casting_*"],
  casing: "snake_case",
} satisfies Config;
