import { domain } from "./dns";
import { R2, D1, KV } from "./storage";

export const auth = new sst.cloudflare.Auth("auth", {
  authenticator: {
    handler: "packages/auth/src/worker",
    domain: "auth." + domain,
    link: [D1, KV],
  },
});

export const workers = new sst.cloudflare.Worker("workers", {
  handler: "apps/workers/src/index",
  domain: "workers." + domain,
  link: [D1, R2, auth],
});
