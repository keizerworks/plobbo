import Cookies from "js-cookie";

const COOKIE_NAME = "active-org-storage";

export const setActiveOrg = (id: string) => {
  if (id) Cookies.set(COOKIE_NAME, id, { maxAge: 1000 * 60 * 60 * 24 * 7 });
  return;
};

export const getActiveOrg = () => {
  const id = Cookies.get(COOKIE_NAME);
  return id;
};

export const deleteActiveOrg = () => {
  Cookies.remove(COOKIE_NAME);
};
