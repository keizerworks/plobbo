import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { baseTable } from '../base';

export const OrganizationTable = sqliteTable("organization", {
  ...baseTable,
  name: text().notNull(),
  subdomain: text().notNull(),
  customDomain: text().notNull(),
  settings: text({ mode: "json"}).$type<
    {
      theme: string,
      logo: string,
      description: string
    }
  >().notNull()
})