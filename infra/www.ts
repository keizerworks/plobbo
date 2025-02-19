import { auth } from "./auth";
import { domain } from "./dns";
import { email } from "./email";
import { secrets } from "./secrets";
import { bucket, NEXT_PUBLIC_S3_DOMAIN, postgres } from "./storage";
import { vpc } from "./vpc";

export const www = new sst.aws.Nextjs("www", {
  path: "apps/www",
  vpc: $app.stage === "production" ? vpc : undefined,
  environment: {
    NEXT_PUBLIC_S3_DOMAIN,
    AUTH_URL: $interpolate`${auth.url}`,
  },
  domain:
    $app.stage === "production"
      ? {
          name: domain,
          dns: sst.cloudflare.dns({ proxy: true }),
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
