import { baseTable } from "db/base-table";
import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
  ...baseTable,
  email: varchar().notNull().unique(),
  name: varchar().notNull(),
  emailVerified: boolean().default(false),
  recoveryCode: varchar(),
  passwordHash: varchar(),
  profilePicture: varchar({ length: 255 }),
});
