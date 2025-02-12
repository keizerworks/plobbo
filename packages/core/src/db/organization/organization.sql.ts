import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseTable } from "../base-table";
import { UserTable } from "../user/user.sql";

export enum MemberRoleEnum {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

export const OrganizationTable = sqliteTable("organization", {
  ...baseTable("org"),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  logo: text({ length: 255 }).notNull(),
});

export const OrganizationMemberTable = sqliteTable("organization_member", {
  ...baseTable("org_member"),
  userId: text()
    .notNull()
    .references(() => UserTable.id),
  organizationId: text()
    .notNull()
    .references(() => OrganizationTable.id),
  role: text({
    enum: [
      MemberRoleEnum.VIEWER,
      MemberRoleEnum.ADMIN,
      MemberRoleEnum.OWNER,
      MemberRoleEnum.EDITOR,
    ],
  }).notNull(),
  profilePicture: text({ length: 255 }),
  bio: text({ length: 255 }),
  displayName: text({ length: 255 }),
});
