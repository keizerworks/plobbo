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
  domain: $dev
    ? undefined
    : {
        name: "plobbo.com",
        redirects: ["www.plobbo.com"],
        dns: sst.cloudflare.dns(),
      },
  server: {
    runtime: "nodejs22.x",
  },
});
