import { domain } from "./dns";
import { email } from "./email";
import { queue } from "./queue";
import { R2, D1, KV } from "./storage";
import { builtinModules } from "node:module";

export const auth = new sst.cloudflare.Auth("auth", {
  authenticator: {
    handler: "packages/auth/src/worker",
    domain: "auth." + domain,
    link: [D1, KV, queue, email],
    build: {
      esbuild: {
        platform: "browser",
        external: [
          ...builtinModules,
          ...builtinModules.map((m) => `node:${m}`),
        ],
      },
    },
  },
});

export const workers = new sst.cloudflare.Worker("workers", {
  handler: "apps/workers/src/index",
  domain: "workers." + domain,
  link: [D1, R2, auth, queue, email],
});
