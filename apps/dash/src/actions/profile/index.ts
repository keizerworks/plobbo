import { cache } from "react";

import workersClient from "~/lib/axios";

export interface Profile {
  id: string;
  name: string | null;
  email: string;
  verified: boolean;
}

export const getProfile = cache(async () => {
  return workersClient.get<Profile>("profile").then((r) => r.data);
});
