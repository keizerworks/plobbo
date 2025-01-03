import { BlogTable } from "db/schema/blog";
import { OrganizationTable } from "db/schema/organization";
import { UserTable } from "db/schema/user";
import { relations } from "drizzle-orm";

export const userRelation = relations(UserTable, ({ one, many }) => ({
  organizationId: one(OrganizationTable, {
    fields: [UserTable.organizationId],
    references: [OrganizationTable.id]
  }),
  blogs: many(BlogTable)
}));