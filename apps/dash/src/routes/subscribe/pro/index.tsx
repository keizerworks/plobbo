import { createFileRoute, redirect } from "@tanstack/react-router";
import { AxiosError } from "axios";

import { getActiveOrg } from "~/actions/cookies/active-org";
import apiClient from "~/lib/axios";

export const Route = createFileRoute("/subscribe/pro/")({
  loader: async () => {
    try {
      const activeOrg = getActiveOrg();
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!activeOrg) throw redirect({ to: "/" });

      const activeOrgId = (
        JSON.parse(activeOrg) as { state: { id: string; version: number } }
      ).state.id;

      const formData = new FormData();
      formData.set("organizationId", activeOrgId);
      const res = await apiClient.post<{ url: string }>("polar", formData);
      location.href = res.data.url;
    } catch (err) {
      if (err instanceof AxiosError)
        if (err.status === 400)
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw redirect({ to: "/" });
      throw err;
    }
  },
});
