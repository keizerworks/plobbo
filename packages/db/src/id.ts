import { ulid } from "ulid";

export const type = {
  user: "usr",
  journey: "jrny",
  blog: "blg",
  org: "org",
  org_domain: "dns",
  org_member: "mem",
  org_sub: "sub",
  org_sub_history: "subh",
} as const;

export const createId = (idType: keyof typeof type) =>
  [type[idType], ulid()].join("_");
