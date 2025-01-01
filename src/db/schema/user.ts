import type { InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseTable } from "../base";

export const UserTable = sqliteTable("user", {
  ...baseTable,
  firstName: text().notNull(),
  lastName: text(),
  email: text(),
  passwordHash: text(),
});

export type UserInterface = InferSelectModel<typeof UserTable>;
