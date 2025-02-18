import { domain } from "./dns";
import { auth, workers } from "./workers";

export const dashboard = new sst.cloudflare.StaticSite("dashboard", {
    environment: {
        VITE_WORKERS_URL: $interpolate`${workers.url}`,
        VITE_AUTH_URL: $interpolate`${auth.url}`,
    },
    domain: "dash." + domain,
    path: "apps/dash",
    build: {
        command: "pnpm run build",
        output: "dist",
    },
});
