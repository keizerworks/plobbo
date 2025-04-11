import { pgTable, text } from "drizzle-orm/pg-core";

import { baseTable } from "../base-table";

export const JourneyTable = pgTable("journey", {
  ...baseTable("journey"),
  title: text().notNull(),
  description: text().notNull(),
});
