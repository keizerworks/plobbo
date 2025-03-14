import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { baseTable } from "../base-table";
import { OrganizationTable } from "../organization/organization.sql";

export const SubscriptionStatusEnum = pgEnum("subscription_status", [
  "ACTIVE",
  "CANCELED",
  "PAST_DUE",
  "UNPAID",
  "TRIALING",
  "PAUSED",
]);

export const SubscriptionPlanEnum = pgEnum("subscription_plan", [
  "FREE",
  "PROFESSIONAL",
  "ENTERPRISE",
]);

export const OrganizationSubscriptionTable = pgTable(
  "organization_subscription",
  {
    ...baseTable("org_sub"),
    id: varchar().notNull().unique(),
    organizationId: varchar({ length: 34 })
      .notNull()
      .references(() => OrganizationTable.id),
    plan: SubscriptionPlanEnum().notNull(),
    status: SubscriptionStatusEnum().notNull(),
    currentPeriodStart: timestamp().notNull(),
    currentPeriodEnd: timestamp(),
    cancelAtPeriodEnd: boolean().default(false).notNull(),
    amount: integer().default(0).notNull(),
    canceledAt: timestamp(),
    trialStart: timestamp(),
    trialEnd: timestamp(),
  },
);

export const OrganizationSubscriptionHistoryTable = pgTable(
  "organization_subscription_history",
  {
    ...baseTable("org_sub_history"),
    id: varchar().notNull().unique(),
    organizationId: varchar({ length: 34 })
      .notNull()
      .references(() => OrganizationTable.id),
    plan: SubscriptionPlanEnum().notNull(),
    status: SubscriptionStatusEnum().notNull(),
    startDate: timestamp().notNull(),
    endDate: timestamp().notNull(),
  },
);

export const OrganizationSubscriptionRelations = relations(
  OrganizationSubscriptionTable,
  ({ one }) => ({
    organization: one(OrganizationTable, {
      fields: [OrganizationSubscriptionTable.organizationId],
      references: [OrganizationTable.id],
    }),
  }),
);
