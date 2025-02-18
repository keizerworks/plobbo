import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseTable } from "../base-table";
import {
    OrganizationMemberTable,
    OrganizationTable,
} from "../organization/organization.sql";

export enum BlogStatusEnum {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
}

export const BlogTable = sqliteTable("blog", {
    ...baseTable("blog"),
    publishedDate: int({ mode: "timestamp_ms" }),
    organizationId: text()
        .references(() => OrganizationTable.id)
        .notNull(),
    authorId: text()
        .references(() => OrganizationMemberTable.id)
        .notNull(),
    slug: text({ length: 255 }).notNull(),
    title: text({ length: 255 }).notNull(),
    image: text({ length: 255 }),
    body: text({ mode: "json" }),
    content: text().default(""),
    tags: text({ mode: "json" }).default([]),
    likes: int().default(0),
    status: text({
        enum: [BlogStatusEnum.PUBLISHED, BlogStatusEnum.DRAFT],
    }).default(BlogStatusEnum.DRAFT),
});

export const BlogMetadataTable = sqliteTable("blog_metadata", {
    ...baseTable,
    blogId: text()
        .unique()
        .notNull()
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
