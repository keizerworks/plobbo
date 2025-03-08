import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { baseTable } from "../base-table";

export const UserTable = pgTable("users", {
  ...baseTable("user"),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }),
  verified: boolean().notNull().default(false),
});

export const WaitlistTable = pgTable("waitlists", {
  id: uuid().defaultRandom().primaryKey(),
  email: varchar().notNull().unique(),
  approved: boolean().default(false).notNull(),
});
