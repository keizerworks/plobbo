import { timestamp, varchar } from "drizzle-orm/pg-core";

import type { type as idType } from "./id";

import { createId } from "./id";

export const baseTable = (type: keyof typeof idType) => ({
  id: varchar({ length: 34 })
    .$defaultFn(() => createId(type))
    .primaryKey(),

  createdAt: timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
});
