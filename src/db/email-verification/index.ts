import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { db } from "db";
import { eq } from "drizzle-orm";

import { EmailVerificationRequestTable } from "./email-verification.sql";

export namespace EmailVerificationRequest {
  export type Model = InferSelectModel<typeof EmailVerificationRequestTable>;
  export type CreateInput = InferInsertModel<
    typeof EmailVerificationRequestTable
  >;
  export type UpdateInput = Partial<CreateInput>;

  export async function create(values: CreateInput) {
    return (
      await db.insert(EmailVerificationRequestTable).values(values).returning()
    )[0];
  }

  export async function update(id: number, input: UpdateInput): Promise<Model> {
    const [emailVerificationRequest] = await db
      .update(EmailVerificationRequestTable)
      .set(input)
      .where(eq(EmailVerificationRequestTable.id, id))
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return emailVerificationRequest!; // INFO: emailVerificationRequest will be defined
  }

  export async function findById(id: number): Promise<Model | undefined> {
    const [emailVerificationRequest] = await db
      .select()
      .from(EmailVerificationRequestTable)
      .where(eq(EmailVerificationRequestTable.id, id))
      .limit(1);
    return emailVerificationRequest;
  }

  export async function findByEmail(email: string): Promise<Model | undefined> {
    const [emailVerificationRequest] = await db
      .select()
      .from(EmailVerificationRequestTable)
      .where(eq(EmailVerificationRequestTable.email, email))
      .limit(1);
    return emailVerificationRequest;
  }

  export async function remove(id: number): Promise<void> {
    await db
      .delete(EmailVerificationRequestTable)
      .where(eq(EmailVerificationRequestTable.id, id));
  }

  export async function removeByEmail(email: string): Promise<void> {
    await db
      .delete(EmailVerificationRequestTable)
      .where(eq(EmailVerificationRequestTable.email, email));
  }
}
