import type { QueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import { getActiveOrgIdFromCookie } from "~/actions/cookies/active-org";
import { getOrganizationsDomainQueryOption } from "~/actions/organization/domain/query-options";

export const Route = createFileRoute(
  "/_configure/configure/_settings/settings/custom-domain/",
)({
  loader: async ({ context }) => {
    const activeOrg = getActiveOrgIdFromCookie();
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    if (!activeOrg) throw redirect({ to: "/" });

    // @ts-expect-error -- for some reason context is not inferring types
    const queryClient = context.queryClient as unknown as QueryClient;

    const activeOrgId = (
      JSON.parse(activeOrg) as { state: { id: string; version: number } }
    ).state.id;

    return queryClient.ensureQueryData(
      getOrganizationsDomainQueryOption(activeOrgId),
    );
  },
  pendingComponent: () => (
    <div className="flex flex-1 items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  ),
});
