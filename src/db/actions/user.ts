import { eq } from "drizzle-orm";

import type { CreateUserInterface } from "../schema/user";
import { db } from "..";
import { UserTable } from "../schema/user";

export const getUserByEmail = async (email: string) => {
  const users = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, email))
    .limit(1);
  return users[0];
};

export const createUser = async (values: CreateUserInterface) => {
  const users = await db.insert(UserTable).values(values).returning();
  if (!users[0]) throw new Error();
  return users[0];
};

export const updateUser = async (
  id: string,
  values: Partial<CreateUserInterface>,
) => {
  await db.update(UserTable).set(values).where(eq(UserTable.id, id)).execute();
};

export const deleteUser = async (id: string) => {
  await db.delete(UserTable).where(eq(UserTable.id, id)).execute();
};
