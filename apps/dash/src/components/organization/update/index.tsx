import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { Organization } from "~/types/organization";
import { organizationsQueryOption } from "~/actions/organization/query-options";
import { emitter } from "~/events/emitter";
import { useActiveOrgStore } from "~/store/active-org";

import { UpdateOrganizationForm } from "./form";

export const UpdateOrganization = () => {
  const queryClient = useQueryClient();
  const id = useActiveOrgStore.use.id();
  const [data, setData] = useState<Organization | null>(null);

  useEffect(() => {
    const data = queryClient.getQueryData(organizationsQueryOption.queryKey);
    setData((data ?? []).find((org) => org.id === id) ?? null);
  }, [id, queryClient]);

  useEffect(() => {
    emitter.on("update:org:refetchquerydata", () => {
      const data = queryClient.getQueryData(organizationsQueryOption.queryKey);
      setData((data ?? []).find((org) => org.id === id) ?? null);
    });
    return () => {
      emitter.off("update:org:refetchquerydata");
    };
  }, [id, queryClient]);

  if (!data) {
    return null;
  }

  return <UpdateOrganizationForm {...data} />;
};
