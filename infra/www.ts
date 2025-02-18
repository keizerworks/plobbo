import { auth } from "./auth";
import { domain } from "./dns";
import { email } from "./email";
import { secrets } from "./secrets";
import { bucket, postgres } from "./storage";
import { vpc } from "./vpc";

export const www = new sst.aws.Nextjs("www", {
  path: "apps/www",
  vpc: $app.stage === "production" ? vpc : undefined,
  environment: {
    AUTH_URL: $interpolate`${auth.url}`,
  },
  domain:
    $app.stage === "production"
      ? {
          name: domain,
          dns: sst.cloudflare.dns(),
          redirects: ["www." + domain],
          // aliases: ["*." + domain],
        }
      : undefined,
  link: [
    bucket,
    postgres,
    email,
    auth,
    secrets.langdbProjectId,
    secrets.langdbApiKey,
    secrets.langdbOpenAIBaseUrl,
  ],
  server: { runtime: "nodejs22.x" },
});
