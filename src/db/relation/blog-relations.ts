import { BlogTable } from "db/schema/blog";
import { OrganizationTable } from "db/schema/organization";
import { UserTable } from "db/schema/user";
import { relations } from "drizzle-orm";

export const blogRelation = relations(BlogTable, ({ one } ) => ({
  author: one(UserTable, {
    fields: [BlogTable.authorId],
    references: [UserTable.id]
  }),
  organizationId: one(OrganizationTable, {
    fields: [BlogTable.organizationId],
    references: [OrganizationTable.id]
  })
}));