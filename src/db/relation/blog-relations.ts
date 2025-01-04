import { BlogTable } from "../schema/blog";
import { OrganizationTable } from "../schema/organization";
import { UserTable } from "../schema/user";
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