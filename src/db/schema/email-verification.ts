import type { InferInsertModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { UserTable } from "./user";

export const EmailVerificationRequestTable = sqliteTable(
  "email_verification_request",
  {
    id: integer().primaryKey(),
    userId: text()
      .notNull()
      .references(() => UserTable.id),
    email: text().notNull(),
    otp: text("otp").notNull(),
    expiresAt: integer("expires_at", {
      mode: "timestamp",
    }).notNull(),
  },
);

export type InsertEmailVerificationRequestInterface = InferInsertModel<
  typeof EmailVerificationRequestTable
>;
