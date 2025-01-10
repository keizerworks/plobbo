import { relations } from "drizzle-orm";

import { OrganizationMemberTable } from "./organization";
import { UserMetadataTable, UserTable } from "./user";

export const userRelations = relations(UserTable, ({ one, many }) => ({
  metadata: one(UserMetadataTable, {
    fields: [UserTable.id],
    references: [UserMetadataTable.userId],
  }),
  organizationMembers: many(OrganizationMemberTable, {
    relationName: "user_organization_members",
  }),
}));

export const userMetadataRelations = relations(
  UserMetadataTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserMetadataTable.userId],
      references: [UserTable.id],
    }),
  }),
);
