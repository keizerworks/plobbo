import { domain } from "./dns";
import { email } from "./email";
import { postgres } from "./storage";
import { vpc } from "./vpc";

export const auth = new sst.aws.Auth("auth", {
  issuer: {
    link: [postgres, email],
    handler: "packages/auth/src/index.handler",
    runtime: "nodejs22.x",
    vpc: $app.stage === "production" ? vpc : undefined,
    nodejs: {
      install: ["@aws-sdk/client-sesv2"],
    },
  },
  forceUpgrade: "v2",
  domain:
    $app.stage === "production"
      ? {
          name: "auth." + domain,
          dns: sst.cloudflare.dns({ override: true, proxy: true }),
        }
      : undefined,
});
