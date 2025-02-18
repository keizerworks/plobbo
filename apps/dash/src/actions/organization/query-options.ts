import { queryOptions } from "@tanstack/react-query";

import { getOrganizations } from "./index";

export const organizationsQueryOption = queryOptions({
  queryKey: ["organizations"],
  queryFn: getOrganizations,
});
