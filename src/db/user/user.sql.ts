import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";

import { baseTable } from "~/db/base-table";

export const UserTable = pgTable("user", {
    ...baseTable,
    email: varchar().notNull().unique(),
    name: varchar().notNull(),
    emailVerified: boolean().default(false),
    recoveryCode: varchar(),
    passwordHash: varchar(),
    profilePicture: varchar({ length: 255 }),
});
