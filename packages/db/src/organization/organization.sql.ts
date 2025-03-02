import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

import { baseTable } from "../base-table";
import {
  OrganizationSubscriptionHistoryTable,
  OrganizationSubscriptionTable,
} from "../subscription/subscription.sql";
import { UserTable } from "../user/user.sql";

export const MemberRoleEnum = pgEnum("member_role", [
  "OWNER",
  "ADMIN",
  "EDITOR",
  "VIEWER",
]);

export const OrganizationTable = pgTable("organization", {
  ...baseTable("org"),
  name: varchar().notNull(),
  slug: varchar().notNull().unique(),
  description: varchar(),
  logo: varchar({ length: 255 }).notNull(),
});

export const OrganizationMemberTable = pgTable("organization_member", {
  ...baseTable("org_member"),
  userId: varchar({ length: 34 })
    .notNull()
    .references(() => UserTable.id),
  organizationId: varchar({ length: 34 })
    .notNull()
    .references(() => OrganizationTable.id),
  role: MemberRoleEnum().notNull(),
  profilePicture: varchar({ length: 255 }),
  bio: varchar({ length: 255 }),
  displayName: varchar({ length: 255 }),
});

export const OrganizationDomainTable = pgTable("organization_domain", {
  organizationId: varchar({ length: 34 })
    .references(() => OrganizationTable.id)
    .primaryKey(),
  domain: varchar({ length: 255 }).notNull(),
  verified: boolean().default(false).notNull(),
  cnameVerified: boolean().default(false).notNull(),
  certificateArn: varchar().notNull(),
});

export const OrganizationRelations = relations(
  OrganizationTable,
  ({ one, many }) => ({
    organization_domain: one(OrganizationDomainTable),
    current_subscription: one(OrganizationSubscriptionTable),
    subscription_history: many(OrganizationSubscriptionHistoryTable),
  }),
);
