import { relations } from "drizzle-orm";

import { OrganizationMemberTable } from "./organization";
import { UserTable } from "./user";

export const userRelations = relations(UserTable, ({ many }) => ({
  organizationMembers: many(OrganizationMemberTable, {
    relationName: "user_organization_members",
  }),
}));
