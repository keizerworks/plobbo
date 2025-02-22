import { queryOptions } from "@tanstack/react-query";

import { getDomainSettings } from "./index";

export const getOrganizationsDomainQueryOption = (organizationId?: string) =>
  queryOptions({
    queryKey: ["organizations", "domain", organizationId],
    queryFn: async () =>
      organizationId ? getDomainSettings(organizationId) : undefined,
    enabled: !!organizationId && organizationId.length > 0,
  });
