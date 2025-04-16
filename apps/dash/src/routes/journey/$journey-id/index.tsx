import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { z } from "zod";

import { getBlogs } from "~/actions/blog";
import { getJourneyById } from "~/actions/journey";
import { getActiveOrgId } from "~/store/active-org";

export const Route = createFileRoute("/journey/$journey-id/")({
  validateSearch: z.object({ name: z.string().optional() }),
  loader: async ({ params }) => {
    const orgId = getActiveOrgId()!;

    const dataPromise = getJourneyById(params["journey-id"]);
    const storiesPromise = getBlogs({
      filter: { journeyId: params["journey-id"], organizationId: orgId },
    });

    const [journey, stories] = await Promise.all([dataPromise, storiesPromise]);
    console.log({ journey, stories });
    return { journey, stories };
  },
  pendingComponent: () => (
    <div className="flex size-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  ),
});
