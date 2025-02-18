import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";

import { baseTable } from "../base-table";

export const UserTable = pgTable("users", {
  ...baseTable("user"),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }),
  verified: boolean().notNull().default(false),
});
