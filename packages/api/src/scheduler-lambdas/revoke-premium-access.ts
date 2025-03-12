import type { ScheduledEvent } from "aws-lambda";

import { OrganizationDomain } from "@plobbo/db/organization/domain";
import { SubscriptionHistory } from "@plobbo/db/subscription/history";
import { OrganizationSubscription } from "@plobbo/db/subscription/index";

import { removeDistributionWithACMCert } from "../lib/cloudfront";

interface RevokePremiumAccessEvent extends ScheduledEvent {
  detail: { subscriptionId: string };
}

export async function handler(event: RevokePremiumAccessEvent) {
  if (event.source !== "aws.events") {
    console.error("Unauthorized invocation detected!");
    return {
      statusCode: 403,
      body: "Unauthorized",
    };
  }

  console.log("Triggered by EventBridge Scheduler:", event);
  // Proceed with your domain removal logic

  const record = await OrganizationSubscription.remove(
    event.detail.subscriptionId,
  );

  if (!record) {
    throw new Error("Failed to remove subscription record");
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

    // process.env.SCHEDULER_ARN
    SubscriptionHistory.create({
      id: record.id,
      organizationId: record.organizationId,
      endDate: record.currentPeriodEnd ?? new Date(),
      plan: record.plan,
      startDate: record.createdAt,
      status: record.status,
    }),
  ]);

  return;
}
