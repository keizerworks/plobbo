import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { baseTable } from "../base";
import { UserTable } from "./user";

export const SessionTable = pgTable("session", {
  ...baseTable,
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type SessionInterface = InferSelectModel<typeof SessionTable>;
export type InsertSessionInterface = InferInsertModel<typeof SessionTable>;
