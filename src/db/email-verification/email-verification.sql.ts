import { pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { UserTable } from "../user/user.sql";

export const EmailVerificationRequestTable = pgTable(
  "email_verification_request",
  {
    id: serial().primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => UserTable.id),
    email: varchar().notNull(),
    otp: varchar().notNull(),
    expiresAt: timestamp()
      .notNull()
      .$defaultFn(() => new Date(Date.now() + 1000 * 60 * 10)),
  },
);
