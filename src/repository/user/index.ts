import type { DB } from "db/types";
import type { Insertable } from "kysely";
import { db } from "db";
import { uuidv7 } from "uuidv7";

export type InsertUserInterface = Omit<Insertable<DB["user"]>, "id">;

export interface UserFilterInterface {
  search?: string;
}

export const insertUser = async (values: InsertUserInterface) => {
  return await db
    .insertInto("user")
    .values({ ...values, id: uuidv7() })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const getUserByEmail = async (email: string) => {
  return await db
    .selectFrom("user")
    .selectAll("user")
    .where("email", "=", email)
    .executeTakeFirst();
};

export const getUser = async (id: string) => {
  return await db
    .selectFrom("user")
    .selectAll("user")
    .where("id", "=", id)
    .executeTakeFirst();
};

export const getUsers = async (filter: UserFilterInterface) => {
  let query = db.selectFrom("user").selectAll();

  if (filter.search) {
    query = query.where((eb) =>
      eb.or([
        eb("name", "ilike", `%${filter.search}%`),
        eb("email", "ilike", `%${filter.search}%`),
      ]),
    );
  }

  return await query.execute();
};

export const updateUser = async (
  id: string,
  values: Omit<Partial<Insertable<DB["user"]>>, "id">,
) => {
  await db
    .updateTable("user")
    .where("id", "=", id)
    .set(values)
    .executeTakeFirstOrThrow();
};

export const deleteUser = async (id: string) => {
  await db.deleteFrom("user").where("id", "=", id).execute();
};
