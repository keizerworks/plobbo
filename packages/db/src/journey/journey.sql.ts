import { pgTable } from "drizzle-orm/pg-core";

import { baseTable } from "../base-table";
import { OrganizationTable } from "../organization/organization.sql";

export const JourneyTable = pgTable("journey", (pg) => ({
  ...baseTable("journey"),
  title: pg.varchar({ length: 255 }),
  image: pg.varchar({ length: 255 }),
  organizaitonId: pg
    .varchar({ length: 34 })
    .references(() => OrganizationTable.id)
    .notNull(),
}));
