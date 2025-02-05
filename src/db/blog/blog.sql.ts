import { baseTable } from "db/base-table";
import {
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  OrganizationMemberTable,
  OrganizationTable,
} from "../organization/organization.sql";

export const BlogStatusEnum = pgEnum("blog_status", ["DRAFT", "PUBLISHED"]);

export const BlogTable = pgTable("blog", {
  ...baseTable,
  publishedDate: timestamp({
    mode: "string",
    withTimezone: true,
  }),
  organizationId: uuid().references(() => OrganizationTable.id),
  authorId: uuid()
    .notNull()
    .references(() => OrganizationMemberTable.id),
  slug: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 255 }),
  body: json().array(),
  content: text().default(""),
  tags: text().array().default([]),
  likes: integer().default(0),
  status: BlogStatusEnum().default("DRAFT"),
});

export const BlogMetadataTable = pgTable("blog_metadata", {
  blogId: uuid()
    .unique()
    .notNull()
    .references(() => BlogTable.id),
  title: text().notNull(),
  description: text().notNull(),
  keywords: text(),
  ogTitle: text(),
  ogDescription: text(),
  ogImage: text(),
  ogUrl: text(),
});

// export const BlogRelations = relations(BlogTable, ({ one }) => ({
//   organizationMember: one(organizationMember, {
//     fields: [blog.authorId],
//     references: [organizationMember.id],
//   }),
//   organization: one(organization, {
//     fields: [blog.organizationId],
//     references: [organization.id],
//   }),
//   blogMetadata: one(blogMetadata, {
//     fields: [blog.id],
//     references: [blogMetadata.blogId],
//   }),
// }));
