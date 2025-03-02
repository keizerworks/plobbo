import { createLazyFileRoute } from "@tanstack/react-router";

import ComingSoon from "~/components/coming-soon";

export const Route = createLazyFileRoute(
  "/_configure/configure/_settings/settings/appearance/",
)({ component: ComingSoon });
