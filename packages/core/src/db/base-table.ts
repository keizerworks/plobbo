import { int, text } from "drizzle-orm/sqlite-core";

import type { type as idType } from "../id";
import { createId } from "../id";

export const baseTable = (type: keyof typeof idType) => ({
  id: text({ length: 34 })
    .$defaultFn(() => createId(type))
    .primaryKey(),

  createdAt: int({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: int({ mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});
