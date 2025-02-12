import { domain } from "./dns";
import { email } from "./email";
import { secrets } from "./secrets";
import { D1, KV } from "./storage";
import { builtinModules } from "node:module";

export const auth = new sst.cloudflare.Auth("auth", {
  authenticator: {
    handler: "packages/auth/src/worker",
    domain: "auth." + domain,
    link: [D1, KV, email],
    transform: {
      worker(args) {
        args.compatibilityDate = "2025-02-08";
        args.compatibilityFlags = $resolve(args.compatibilityFlags ?? []).apply(
          (v) => [...v, "nodejs_compat"],
        );

        args.r2BucketBindings = $resolve(args.r2BucketBindings ?? []).apply(
          (v) => [...v, { bucketName: "plobbo", name: "R2" }],
        );
      },
    },
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
  environment: {
    BUCKET: "plobbo",
  },
  domain: "workers." + domain,
  link: [D1, auth, email, secrets.r2BaseUrl],
  transform: {
    worker(args) {
      args.compatibilityDate = "2025-02-08";
      args.compatibilityFlags = $resolve(args.compatibilityFlags ?? []).apply(
        (v) => [...v, "nodejs_compat"],
      );
    },
  },
});
