import { queryOptions } from "@tanstack/react-query";

import { getProfile } from "./index";

export const profileQueryOption = queryOptions({
  queryKey: ["profile"],
  queryFn: getProfile,
});
