import { defineConfig } from "drizzle-kit";
import { Resource } from "sst/resource";

export default defineConfig({
  dialect: "postgresql",
  casing: "snake_case",
  out: "./migrations",
  schema: ["./src/db/*.sql.ts"],
  dbCredentials: {
    host: Resource["plobbo-pg"].host,
    port: Resource["plobbo-pg"].port,
    database: Resource["plobbo-pg"].database,
    password: Resource["plobbo-pg"].password,
  },
});
