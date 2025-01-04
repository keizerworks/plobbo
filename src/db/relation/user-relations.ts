import { BlogTable } from "../schema/blog";
import { OrganizationTable } from "../schema/organization";
import { UserTable } from "../schema/user";
import { relations } from "drizzle-orm";

export const userRelation = relations(UserTable, ({ one, many }) => ({
  organizationId: one(OrganizationTable, {
    fields: [UserTable.organizationId],
    references: [OrganizationTable.id]
  }),
  blogs: many(BlogTable)
}));