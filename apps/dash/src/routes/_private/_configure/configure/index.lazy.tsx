import { createLazyFileRoute } from "@tanstack/react-router";

import ComingSoon from "~/components/coming-soon";

export const Route = createLazyFileRoute("/_private/_configure/configure/")({
  component: ComingSoon,
});
