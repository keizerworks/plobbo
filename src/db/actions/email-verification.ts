import { desc, eq } from "drizzle-orm";

import type { InsertEmailVerificationRequestInterface } from "../schema/email-verification";
import { db } from "..";
import { EmailVerificationRequestTable } from "../schema/email-verification";

export const createEmailVerificationRequest = async (
  values: InsertEmailVerificationRequestInterface,
) => {
  const res = await db
    .insert(EmailVerificationRequestTable)
    .values(values)
    .returning();
  return res[0];
};

export const deletedEmailVerificationRequestByEmail = async (email: string) => {
  await db
    .delete(EmailVerificationRequestTable)
    .where(eq(EmailVerificationRequestTable.email, email));
};

export const getEmailVerificationRequestByEmail = async (email: string) => {
  const res = await db
    .select()
    .from(EmailVerificationRequestTable)
    .where(eq(EmailVerificationRequestTable.email, email))
    .limit(1)
    .orderBy(desc(EmailVerificationRequestTable.id));
  return res[0];
};
