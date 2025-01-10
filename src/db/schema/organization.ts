import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { baseTable } from "db/base";
import { jsonb, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { UserTable } from "./user";

export interface OrgUserMetadata {
  display_name: string;
  profile_image?: string;
  bio?: string;
  //
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customFields?: Record<string, any>;
}

export const orgRoleEnum = pgEnum("role", [
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
});

// Junction table for user-organization relationship with roles
export const OrganizationMemberTable = pgTable("organization_member", {
  ...baseTable,
  userId: uuid()
    .notNull()
    .references(() => UserTable.id),
  organizationId: uuid()
    .notNull()
    .references(() => OrganizationTable.id),
  role: orgRoleEnum().notNull(),
  // Organization-specific metadata
  orgMetadata: jsonb().$type<OrgUserMetadata>().notNull(), // Stores org-specific profile data
});

export type OrganizationInterface = InferSelectModel<typeof OrganizationTable>;
export type CreateOrganizationInterface = InferInsertModel<
  typeof OrganizationTable
>;

export type OrganizationMemberInterface = InferSelectModel<
  typeof OrganizationMemberTable
>;
export type CreateOrganizationMemberInterface = InferInsertModel<
  typeof OrganizationMemberTable
>;
