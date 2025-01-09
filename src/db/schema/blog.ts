import type { InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseTable } from "../base";
import { OrganizationTable } from "./organization";
import { UserTable } from "./user";

export const BlogTable = sqliteTable("blog", {
  ...baseTable,
  organizationId: text().references(() => OrganizationTable.id),
  authorId: text()
    .references(() => UserTable.id)
    .notNull(),
  title: text().notNull(),
  slug: text().notNull(),
  image: text().notNull(),
  body: text().notNull(),
  tags: text({ mode: "json" })
    .notNull()
    .$type<string[]>()
    .default(sql`'[]'`),
  likes: integer().notNull().default(0),
  status: text({ enum: ["draft", "published"] }).notNull(),
});

export type BlogInterface = InferSelectModel<typeof BlogTable>;
