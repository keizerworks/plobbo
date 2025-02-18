import { ulid } from "ulid";

export const type = {
  user: "usr",
  blog: "blg",
  org: "org",
  org_member: "mem",
} as const;

export const createId = (idType: keyof typeof type) =>
  [type[idType], ulid()].join("_");
