import { eq } from "drizzle-orm";

import type { InsertUserInterface, UserInterface } from "../schema/user";
import { db } from "..";
import { UserTable } from "../schema/user";

export const getUserByEmail = async (
  email: string,
): Promise<UserInterface | null> => {
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, email))
    .limit(1);
  return user;
};

export const createUser = async (values: InsertUserInterface) => {
  const [user] = await db.insert(UserTable).values(values).returning();
  return user;
};

export const updateUser = async (
  id: string,
  values: Partial<InsertUserInterface>,
) => {
  await db.update(UserTable).set(values).where(eq(UserTable.id, id)).execute();
};

export const deleteUser = async (id: string) => {
  await db.delete(UserTable).where(eq(UserTable.id, id)).execute();
};
