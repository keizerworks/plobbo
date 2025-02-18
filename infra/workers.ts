import { builtinModules } from "node:module";

import { domain } from "./dns";
import { email } from "./email";
import { secrets } from "./secrets";
import { BUCKET, D1, KV, R2 } from "./storage";

export const auth = new sst.cloudflare.Auth("auth", {
    authenticator: {
        handler: "packages/auth/src/worker",
        domain: "auth." + domain,
        url: true,
        link: [D1, KV, email],
        transform: {
            worker(args) {
                args.placements = $resolve(args.placements ?? []).apply((v) => [
                    ...v,
                    { mode: "smart" },
                ]);
                args.compatibilityDate = "2025-02-08";
                args.compatibilityFlags = $resolve(
                    args.compatibilityFlags ?? [],
                ).apply((v) => [...v, "nodejs_compat"]);
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
        BUCKET,
        AUTH_URL: $interpolate`${auth.url}`,
        LANGDB_PROJECT_ID: $interpolate`${secrets.langdbProjectId.value}`,
        LANGDB_API_KEY: $interpolate`${secrets.langdbApiKey.value}`,
        LANGDB_OPENAI_BASE_URL: $interpolate`${secrets.langdbOpenAIBaseUrl.value}`,
    },
    domain: "workers." + domain,
    link: [D1, R2, KV, email, auth, secrets.r2BaseUrl],
    transform: {
        worker(args) {
            args.placements = $resolve(args.placements ?? []).apply((v) => [
                ...v,
                { mode: "smart" },
            ]);
            args.compatibilityDate = "2025-02-08";
            args.compatibilityFlags = $resolve(
                args.compatibilityFlags ?? [],
            ).apply((v) => [...v, "nodejs_compat"]);
        },
    },
});
