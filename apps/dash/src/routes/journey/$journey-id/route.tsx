import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { z } from "zod";

import { getJourney, getJourneyById } from "~/actions/journey";

export const Route = createFileRoute("/journey/$journey-id")({
  validateSearch: z.object({ name: z.string().optional() }),
  loader: async ({ params }) => {
    const data = await getJourneyById(params["journey-id"]);
    return data;
  },
  pendingComponent: () => (
    <div className="flex size-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  ),
});
