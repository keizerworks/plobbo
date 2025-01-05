import { baseTable } from "db/base";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { OrganizationTable } from "./organization";
import { UserTable } from "./user";
import { sql } from "drizzle-orm";

export const BlogTable = sqliteTable("blog", {
  ...baseTable,
  organizationId: text().references(() => OrganizationTable.id),
  authorId: text().references(() => UserTable.id).notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  image: text().notNull(),
  body: text().notNull(),
  tags: text({ mode: "json" }).notNull().$type<string[]>().default(sql`'[]'`),
  likes: integer().notNull().default(0),
  status: text({ enum: ["draft", "published"]}).notNull()
})