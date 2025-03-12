import {
  CreateScheduleCommand,
  SchedulerClient,
} from "@aws-sdk/client-scheduler";
import { zValidator } from "@hono/zod-validator";
import { Webhooks } from "@polar-sh/hono";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono/quick";
import { Resource } from "sst/resource";
import { z } from "zod";

import { OrganizationDomain } from "@plobbo/db/organization/domain";
import { SubscriptionHistory } from "@plobbo/db/subscription/history";
import { OrganizationSubscription } from "@plobbo/db/subscription/index";

import { removeDistributionWithACMCert } from "../lib/cloudfront";
import { polar } from "../lib/polar";
import { enforeAuthMiddleware } from "../middleware/auth";
import { enforeHasOrgMiddleware } from "../middleware/org-protected";

const schedulerClient = new SchedulerClient({ region: "us-east-1" });
const polarRouter = new Hono();

polarRouter.get(
  "/",

  enforeAuthMiddleware,
  enforeHasOrgMiddleware("organizationId"),

  zValidator("form", z.object({ organizationId: z.string() })),
);

polarRouter.post(
  "/",

  enforeAuthMiddleware,
  enforeHasOrgMiddleware("organizationId"),

  zValidator("form", z.object({ organizationId: z.string() })),

  async (c) => {
    const user = c.var.user;
    const organization = c.var.organization;

    let customer = await polar.customers
      .list({ email: user.email })
      .then((r) => r.result.items[0]);

    if (!customer) {
      customer = await polar.customers.create({ email: user.email });
    }

    const subscription = await OrganizationSubscription.findOne({
      organizationId: organization.id,
    });

    if (subscription?.status === "ACTIVE") {
      throw new HTTPException(400, {
        message: "Organization already has an active subscription",
      });
    }

    const checkout = await polar.checkouts.create({
      productId: Resource.PolarPremiumProductId.value,
      customerId: customer.id,
      successUrl: process.env.DASH_URL + "/checkout/status",
      metadata: { organizationId: organization.id },
      allowDiscountCodes: false,
    });

    return c.json({ url: checkout.url });
  },
);

polarRouter.post(
  "/webhook",
  Webhooks({
    webhookSecret: Resource.PolarWebhookSecret.value,

    async onSubscriptionCreated({ data }) {
      await OrganizationSubscription.create({
        id: data.id,
        currentPeriodEnd: data.currentPeriodEnd,
        currentPeriodStart: data.currentPeriodStart,
        organizationId: data.metadata.organizationId as string,
        plan: "PROFESSIONAL",
        status: data.status === "active" ? "ACTIVE" : "UNPAID",
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      });
    },

    async onSubscriptionCanceled({ data }) {
      const command = new CreateScheduleCommand({
        Name: `subscriptionScheduler-${data.id}`,
        ScheduleExpression: `at(${data.endsAt?.toISOString()})`, // Format: "YYYY-MM-DDTHH:MM:SSZ"
        FlexibleTimeWindow: { Mode: "OFF" },
        Target: {
          Arn: process.env.REVOKE_ACCESS_LAMBDA_ARN,
          RoleArn: process.env.SCHEDULER_ARN,
          Input: JSON.stringify({
            action: "revokeAccess",
            subscriptionId: data.id,
          }),
        },
      });
      await schedulerClient.send(command);

      await OrganizationSubscription.update({
        id: data.id,
        status: "CANCELED",
        canceledAt: data.canceledAt,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        currentPeriodEnd: data.currentPeriodEnd,
        currentPeriodStart: data.currentPeriodStart,
      });
    },

    async onSubscriptionUncanceled({ data }) {
      await OrganizationSubscription.update({
        id: data.id,
        status: "ACTIVE",
        canceledAt: data.canceledAt,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        currentPeriodEnd: data.currentPeriodEnd,
        currentPeriodStart: data.currentPeriodStart,
      });
    },

    async onSubscriptionRevoked({ data }) {
      const record = await OrganizationSubscription.remove(data.id);

      if (!record) {
        throw new HTTPException(500, {
          message: "Failed to remove subscription record",
        });
      }

      await Promise.all([
        OrganizationDomain.findUnique(record.organizationId).then(async (r) => {
          if (!r) {
            return;
          }

          await Promise.all([
            removeDistributionWithACMCert(r.domain),
            OrganizationDomain.update({
              organizationId: r.organizationId,
              cnameVerified: false,
              verified: false,
            }),
          ]);
        }),

        SubscriptionHistory.create({
          id: record.id,
          organizationId: record.organizationId,
          endDate: data.endsAt ?? data.endedAt ?? new Date(),
          plan: record.plan,
          startDate: record.createdAt,
          status: record.status,
        }),
      ]);
    },
  }),
);

export default polarRouter;
