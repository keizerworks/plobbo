import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseTable } from "../base";
import { OrganizationTable } from "./organization";

export const UserTable = sqliteTable("user", {
  ...baseTable,
  firstName: text().notNull(),
  lastName: text(),
  email: text(),
  passwordHash: text(),
  emailVerified: integer({ mode: "boolean" }),
  organizationId: text().references(() => OrganizationTable.id),
});

export type UserInterface = InferSelectModel<typeof UserTable>;
export type InsertUserInterface = InferInsertModel<typeof UserTable>;
