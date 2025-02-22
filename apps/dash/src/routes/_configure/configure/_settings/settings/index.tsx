import type { QueryClient } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import { getOrganizationQueryOption } from "~/actions/organization/query-options";
import { getActiveOrgId } from "~/store/active-org";

export const Route = createFileRoute(
  "/_configure/configure/_settings/settings/",
)({
  loader: async ({ context }) => {
    const activeOrgId = getActiveOrgId();
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    if (!activeOrgId) throw redirect({ to: "/" });
    //
    // @ts-expect-error -- for some reason context is not inferring types
    const queryClient = context.queryClient as unknown as QueryClient;
    const data = await queryClient.ensureQueryData(
      getOrganizationQueryOption(activeOrgId),
    );
    //
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    if (!data) throw notFound();
    return;
  },
  pendingComponent: () => (
    <div className="flex flex-1 items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  ),
});
