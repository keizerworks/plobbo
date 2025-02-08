import { drizzle } from "drizzle-orm/d1";
import { Resource } from "sst/resource";

export const getDrizzle = () =>
  drizzle(Resource["d1"], { casing: "snake_case" });

export type Drizzle = ReturnType<typeof getDrizzle>;

export * from "drizzle-orm";
