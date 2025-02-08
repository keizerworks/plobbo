import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseTable } from "../base-table";

export const UserTable = sqliteTable("users", {
  ...baseTable("user"),
  email: text({ length: 255 }).notNull().unique(),
  name: text({ length: 255 }),
  verified: int({ mode: "boolean" }).notNull().default(false),
});
