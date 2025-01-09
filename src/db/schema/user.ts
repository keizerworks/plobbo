import type { InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseTable } from "../base";
import { OrganizationTable } from "./organization";

export const UserTable = sqliteTable("user", {
  ...baseTable,
  firstName: text().notNull(),
  lastName: text(),
  email: text(),
  passwordHash: text(),
  role: text({ enum: ["admin", "editor"] }).notNull(),
  organizationId: text().references(() => OrganizationTable.id),
});

export type UserInterface = InferSelectModel<typeof UserTable>;
