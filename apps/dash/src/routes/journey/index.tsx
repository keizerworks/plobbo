import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { getActiveOrgIdFromCookie } from "~/actions/cookies/active-org";
import { getJourney } from "~/actions/journey";
import { Skeleton } from "~/components/ui/skeleton";

export const Route = createFileRoute("/journey/")({
  validateSearch: z.object({
    jrny: z.string().optional(),
  }),
  loader: async () => {
    const activeOrg = getActiveOrgIdFromCookie();
    if (!activeOrg) throw redirect({ to: "/" });
    const activeOrgId = (
      JSON.parse(activeOrg) as { state: { id: string; version: number } }
    ).state.id;
    const journeys = await getJourney(activeOrgId);
    console.log({
      journeys,
      activeOrgId,
    });
    return { journeys, activeOrgId };
  },
  pendingComponent: () => (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-y-2 p-4">
      <div className="ml-auto flex items-center gap-x-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-7 w-52" />
      </div>
    </main>
  ),
});
