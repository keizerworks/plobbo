import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { baseTable } from "../base";

export const UserTable = pgTable("user", {
  ...baseTable,
  email: varchar().notNull().unique(),
  name: varchar().notNull(),
  emailVerified: boolean().notNull().default(false),
  recoveryCode: varchar(),
  passwordHash: text(),
});

export type UserInterface = InferSelectModel<typeof UserTable>;
export type CreateUserInterface = InferInsertModel<typeof UserTable>;
