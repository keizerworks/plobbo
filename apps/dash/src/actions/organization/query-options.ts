import { queryOptions } from "@tanstack/react-query";

import { getOrganization, getOrganizations } from "./index";

export const organizationsQueryOption = queryOptions({
  queryKey: ["organizations"],
  queryFn: getOrganizations,
});

export const getOrganizationQueryOption = (id: string) =>
  queryOptions({
    queryKey: ["organizations", id],
    queryFn: async () => getOrganization(id),
  });
