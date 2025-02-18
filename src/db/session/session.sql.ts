import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { baseTable } from "~/db/base-table";

import { UserTable } from "../user/user.sql";

export const SessionTable = pgTable("session", {
    ...baseTable,
    id: text().primaryKey(),
    userId: uuid()
        .notNull()
        .references(() => UserTable.id),
    expiresAt: timestamp().notNull(),
});
