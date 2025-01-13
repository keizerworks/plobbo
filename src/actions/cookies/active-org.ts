"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "active:org";

export const setActiveOrg = async (id: string) => {
  const store = await cookies();
  store.set(COOKIE_NAME, id, { maxAge: 1000 * 60 * 60 * 24 * 7 });
  return;
};

export const getActiveOrg = async () => {
  const store = await cookies();
  const id = store.get(COOKIE_NAME);
  return id?.value;
};

export const deleteActiveOrg = async () => {
  const store = await cookies();
  store.delete(COOKIE_NAME);
};
