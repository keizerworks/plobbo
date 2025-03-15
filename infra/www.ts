import { auth } from "./auth";
import { valkey } from "./cache";
import { altDomain, domain } from "./dns";
import { email } from "./email";
import {
  revokeSubscriptionFunction,
  schedulerRoleEventBridge,
} from "./scheduler";
import { secrets } from "./secrets";
import { bucket, NEXT_PUBLIC_S3_DOMAIN, postgres } from "./storage";
import { vpc } from "./vpc";

export const www = new sst.aws.Nextjs("www", {
  path: "apps/www",
  vpc: $app.stage === "production" ? vpc : undefined,
  environment: {
    NEXT_PUBLIC_S3_DOMAIN,
    AUTH_URL: $interpolate`${auth.url}`,
    SCHEDULER_ARN: $interpolate`${schedulerRoleEventBridge.arn}`,
    REVOKE_ACCESS_LAMBDA_ARN: $interpolate`${revokeSubscriptionFunction.arn}`,
    DASH_URL:
      $app.stage === "production"
        ? "https://dash.plobbo.com"
        : "http://localhost:3001",
  },
  warm: 2,
  domain:
    $app.stage === "production"
      ? {
          name: domain,
          dns: sst.cloudflare.dns({ proxy: true }),
          aliases: [altDomain],
        }
      : undefined,
  link: [
    schedulerRoleEventBridge,
    bucket,
    postgres,
    email,
    valkey,
    auth,
    revokeSubscriptionFunction,
    secrets.langdbProjectId,
    secrets.langdbApiKey,
    secrets.langdbOpenAIBaseUrl,
    secrets.CloudfrontWWWUrl,
    secrets.CloudfrontDistributionID,
    secrets.PolarPremiumProductId,
    secrets.PolarAPIToken,
    secrets.PolarWebhookSecret,
    secrets.IsWaitlistMode,
  ],
  server: { runtime: "nodejs22.x" },
  permissions: [
    {
      resources: ["*"],
      actions: [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetDistribution",
        "cloudfront:UpdateDistribution",
      ],
      effect: "allow",
    },
    {
      resources: ["*"],
      actions: [
        "acm:RequestCertificate",
        "acm:DeleteCertificate",
        "acm:DescribeCertificate",
        "acm:ListCertificates",
      ],
      effect: "allow",
    },
  ],
});
