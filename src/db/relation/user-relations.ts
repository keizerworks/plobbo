import { relations } from "drizzle-orm";

import { BlogTable } from "../schema/blog";
import { OrganizationTable } from "../schema/organization";
import { UserTable } from "../schema/user";

export const userRelation = relations(UserTable, ({ one, many }) => ({
  organizationId: one(OrganizationTable, {
    fields: [UserTable.organizationId],
    references: [OrganizationTable.id],
  }),
  blogs: many(BlogTable),
}));
