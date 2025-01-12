import type { DB } from "db/types";
import type { Insertable } from "kysely";
import { db } from "db";

type CreateEmailVerificationInterface = Omit<
  Insertable<DB["email_verification_request"]>,
  "id"
>;

export const getEmailVerificationRequestByEmail = async (email: string) => {
  return await db
    .selectFrom("email_verification_request")
    .selectAll("email_verification_request")
    .where("email", "=", email)
    .executeTakeFirstOrThrow();
};

export const deleteEmailVerificationRequestByEmail = async (email: string) => {
  await db
    .deleteFrom("email_verification_request")
    .where("email", "=", email)
    .execute();
};

export const createEmailVerificationRequest = async (
  values: CreateEmailVerificationInterface,
) => {
  await db.insertInto("email_verification_request").values(values).execute();
};
