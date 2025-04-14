import { relations } from "drizzle-orm";
import {
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { baseTable } from "../base-table";
import { JourneyTable } from "../journey/journey.sql";
import {
  OrganizationMemberTable,
  OrganizationTable,
} from "../organization/organization.sql";

export const BlogStatusEnum = pgEnum("blog_status", ["DRAFT", "PUBLISHED"]);

export const BlogTable = pgTable("blog", {
  ...baseTable("blog"),

  organizationId: varchar({ length: 34 })
    .references(() => OrganizationTable.id)
    .notNull(),
  authorId: varchar({ length: 34 })
    .references(() => OrganizationMemberTable.id)
    .notNull(),
  journeyId: varchar({ length: 34 })
    .references(() => JourneyTable.id)
    .notNull(),

  title: text().notNull(),
  slug: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 255 }),

  body: json().array(),
  content: text().default(""),

  publishedDate: timestamp({ withTimezone: true }),
  publishedBody: json().array(),
  publishedContent: text().default(""),

  tags: text().array().default([]),
  likes: integer().default(0),
  status: BlogStatusEnum().default("DRAFT"),
});

export const BlogMetadataTable = pgTable("blog_metadata", {
  blogId: varchar({ length: 34 })
    .primaryKey()
    .references(() => BlogTable.id),
  description: text().notNull(),
  keywords: text(),
  ogTitle: text(),
  ogDescription: text(),
  ogImage: text(),
  ogUrl: text(),
});

export const BlogsRelation = relations(BlogTable, ({ one }) => ({
  blog_metadata: one(BlogMetadataTable),
}));
