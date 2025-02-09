import { baseTable } from "db/base-table";
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { UserTable } from "../user/user.sql";

export const MemberRoleEnum = pgEnum("member_role", [
  "OWNER",
  "ADMIN",
  "EDITOR",
  "VIEWER",
]);

export const OrganizationTable = pgTable("organization", {
  ...baseTable,
  name: varchar().notNull(),
  slug: varchar().notNull().unique(),
  description: varchar(),
  logo: varchar({ length: 255 }).notNull(),
});

export const OrganizationMemberTable = pgTable("organization_member", {
  ...baseTable,
  userId: uuid()
    .notNull()
    .references(() => UserTable.id),
  organizationId: uuid()
    .notNull()
    .references(() => OrganizationTable.id),
  role: MemberRoleEnum().notNull(),
  profilePicture: varchar({ length: 255 }),
  bio: varchar({ length: 255 }),
  displayName: varchar({ length: 255 }),
});
