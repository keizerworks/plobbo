import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { UserTable } from "./user";

export const SessionTable = sqliteTable("session", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => UserTable.id),
  //
  // INFO:
  // add expiration here
  expiresAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)),
});

export type SessionInterface = InferSelectModel<typeof SessionTable>;
export type InsertSessionInterface = InferInsertModel<typeof SessionTable>;
