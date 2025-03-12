import * as pulumi from "@pulumi/pulumi";

import { postgres } from "./storage";
import { vpc } from "./vpc";

export const revokeSubscriptionFunction = new sst.aws.Function(
  "revokeSubscriptionFunction",
  {
    handler: "packages/api/src/scheduler-lambdas/revoke-premium-access.handler",
    vpc: $app.stage === "production" ? vpc : undefined,
    link: [postgres],
    permissions: [
      {
        resources: ["*"],
        actions: [
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
  },
);

export const schedulerRoleEventBridge: aws.iam.Role = new aws.iam.Role(
  "schedulerRole",
  {
    assumeRolePolicy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: "sts:AssumeRole",
          Principal: { Service: "scheduler.amazonaws.com" },
        },
      ],
    }),
  },
);

// Attach EventBridge permissions
new aws.iam.RolePolicyAttachment("schedulerEventPolicy", {
  role: $interpolate`${schedulerRoleEventBridge.name}`,
  policyArn: "arn:aws:iam::aws:policy/AmazonEventBridgeFullAccess",
});

const policyDocument = pulumi
  .all([revokeSubscriptionFunction.arn])
  .apply(([functionArn]) => {
    return JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: "lambda:InvokeFunction",
          Resource: functionArn,
        },
      ],
    });
  });

// ✅ Add permission to invoke Lambda
new aws.iam.RolePolicy("schedulerLambdaInvokePolicy", {
  role: $interpolate`${schedulerRoleEventBridge.id}`,
  policy: policyDocument,
});
