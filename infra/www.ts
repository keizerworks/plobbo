import { domain } from "./dns";
import { email } from "./email";
import { secret } from "./secret";
import {
    bucket,
    DATABASE_URL,
    NEXT_PUBLIC_S3_DOMAIN,
    postgres,
} from "./storage";
import { vpc } from "./vpc";

export const www = new sst.aws.Nextjs("www", {
    vpc: $app.stage === "production" ? vpc : undefined,
    domain:
        $app.stage === "production"
            ? {
                  name: domain,
                  aliases: ["*." + domain],
                  redirects: ["www." + domain],
                  dns: sst.cloudflare.dns({ override: true, proxy: true }),
              }
            : undefined,
    link: [
        postgres,
        bucket,
        email,
        secret.langdbProjectId,
        secret.langdbApiKey,
        secret.langdbOpenAIBaseUrl,
    ],
    environment: { DATABASE_URL, NEXT_PUBLIC_S3_DOMAIN },
    server: { runtime: "nodejs22.x" },
});
