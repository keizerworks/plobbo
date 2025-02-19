import { cache } from "react";

import apiClient from "~/lib/axios";

export interface Profile {
  id: string;
  name: string | null;
  email: string;
  verified: boolean;
}

export const getProfile = cache(async () => {
  return apiClient.get<Profile>("profile").then((r) => r.data);
});
