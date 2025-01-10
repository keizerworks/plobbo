import type { InferInsertModel } from "drizzle-orm";
import { pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { UserTable } from "./user";

export const EmailVerificationRequestTable = pgTable(
  "email_verification_request",
  {
    id: serial().primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    email: varchar().notNull(),
    otp: varchar().notNull(),
    expiresAt: timestamp({
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
);

export type CreateEmailVerificationRequestInterface = InferInsertModel<
  typeof EmailVerificationRequestTable
>;
