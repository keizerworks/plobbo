import { createFileRoute } from "@tanstack/react-router";

import type { PolarSubscription } from "~/types/organization";
import apiClient from "~/lib/axios";
import { getActiveOrg } from "~/store/active-org";

export const Route = createFileRoute(
  "/_private/_configure/configure/_settings/settings/subscription/",
)({
  loader: async () => {
    const org = getActiveOrg();
    if (!org) throw new Error();
    if (!org.subscription) return null;
    return apiClient
      .get<PolarSubscription | null>(
        "polar/" + org.id + "/" + org.subscription.id,
      )
      .then((res) => res.data);
  },
});
