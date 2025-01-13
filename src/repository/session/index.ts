import type { DB } from "db/types";
import type { Insertable } from "kysely";
import { db } from "db";
import { jsonObjectFrom } from "kysely/helpers/postgres";

export type InsertSessionInterface = Insertable<DB["session"]>;
export interface SessionWithInterface {
  user?: boolean;
}

export const insertSession = async (values: InsertSessionInterface) => {
  return await db
    .insertInto("session")
    .values({ ...values })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const getSession = async (
  id: string,
  withOption?: SessionWithInterface,
) => {
  return await db
    .selectFrom("session")
    .select((eb) => [
      "session.id",
      "session.user_id",
      "session.expires_at",
      "session.created_at",
      "session.updated_at",
      ...(withOption?.user
        ? [
            jsonObjectFrom(
              eb
                .selectFrom("user")
                .selectAll("user")
                .whereRef("user.id", "=", "session.user_id"),
            ).as("user"),
          ]
        : []),
    ])
    .where("id", "=", id)
    .executeTakeFirst();
};

export const getSessionByUserId = async (userId: string) => {
  return await db
    .selectFrom("session")
    .selectAll()
    .where("user_id", "=", userId)
    .executeTakeFirst();
};

export const getValidSession = async (id: string) => {
  return await db
    .selectFrom("session")
    .selectAll()
    .where("id", "=", id)
    .where("expires_at", ">", new Date())
    .executeTakeFirst();
};

export const updateSession = async (
  id: string,
  values: Partial<Omit<Insertable<DB["session"]>, "id">>,
) => {
  await db
    .updateTable("session")
    .where("id", "=", id)
    .set(values)
    .executeTakeFirstOrThrow();
};

export const deleteSession = async (id: string) => {
  await db.deleteFrom("session").where("id", "=", id).execute();
};

export const deleteExpiredSessions = async () => {
  await db
    .deleteFrom("session")
    .where("expires_at", "<=", new Date())
    .execute();
};

export const deleteUserSessions = async (userId: string) => {
  await db.deleteFrom("session").where("user_id", "=", userId).execute();
};
