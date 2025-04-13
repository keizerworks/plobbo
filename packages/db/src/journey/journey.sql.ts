import { pgTable, text, varchar } from "drizzle-orm/pg-core";

import { baseTable } from "../base-table";
import { OrganizationMemberTable } from "../organization/organization.sql";

export const JourneyTable = pgTable("journey", {
  ...baseTable("journey"),
  title: text().notNull(),
  description: text().notNull(),
  authorId: varchar({ length: 34 })
    .references(() => OrganizationMemberTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
});
