import { timestamp, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const baseTable = {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
};
