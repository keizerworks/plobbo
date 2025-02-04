import { domain } from "./dns";
import { email } from "./email";
import {
  bucket,
  DATABASE_URL,
  NEXT_PUBLIC_S3_DOMAIN,
  postgres,
} from "./storage";

export const app = new sst.aws.Nextjs("plobbo-www", {
  link: [postgres, bucket, email],
  environment: { DATABASE_URL, NEXT_PUBLIC_S3_DOMAIN },
  domain:
    $app.stage === "production"
      ? {
          name: domain,
          redirects: ["www." + domain],
          dns: sst.cloudflare.dns(),
        }
      : undefined,
  server: {
    runtime: "nodejs22.x",
  },
});
