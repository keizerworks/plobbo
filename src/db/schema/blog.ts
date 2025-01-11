import type { InferSelectModel } from "drizzle-orm";
import { baseTable } from "db/base";
import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { OrganizationMemberTable, OrganizationTable } from "./organization";

export const blogStatusEnum = pgEnum("blog_status", ["DRAFT", "PUBLISHED"]);

export const BlogTable = pgTable("blog", {
  ...baseTable,
  organizationId: uuid().references(() => OrganizationTable.id),
  authorId: uuid()
    .references(() => OrganizationMemberTable.id)
    .notNull(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 255 }),
  body: text().notNull(),
  tags: jsonb()
    .$type<string[]>()
    .default(sql`'[]'`),
  likes: integer().notNull().default(0),
  status: blogStatusEnum().notNull().default("DRAFT"),
});

export type BlogInterface = InferSelectModel<typeof BlogTable>;
