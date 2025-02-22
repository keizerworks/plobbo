/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

import { getOrganizationQueryOption } from "~/actions/organization/query-options";
import { UpdateOrganizationForm } from "~/components/organization/update/form";
import { useActiveOrgStore } from "~/store/active-org";

export const Route = createLazyFileRoute(
  "/_configure/configure/_settings/settings/",
)({ component: RouteComponent });

function RouteComponent() {
  const id = useActiveOrgStore.use.id()!;
  const query = useSuspenseQuery(getOrganizationQueryOption(id));
  const data = query.data!;
  return <UpdateOrganizationForm {...data} />;
}
