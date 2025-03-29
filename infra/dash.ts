import { domain } from "./dns";
import { www } from "./www";

export const dashboard = new sst.aws.StaticSite("dashboard", {
  environment: {
    VITE_URL:
      $app.stage === "production"
        ? $interpolate`${www.url}/api`
        : "http://localhost:3000/api",
  },
  domain: {
    name: "dash." + domain,
    dns: sst.cloudflare.dns({ proxy: true }),
  },
  path: "apps/dash",
  build: {
    command: "pnpm run build",
    output: "dist",
  },
});
