import type { Organization } from "~/types/organization";
import apiClient from "~/lib/axios";

export const getOrganizations = async () =>
  apiClient.get<Organization[]>("organizations").then((r) => r.data);

export const getOrganization = async (id: string) =>
  apiClient
    .get<Organization | undefined>("organizations/" + id)
    .then((r) => r.data);

export const createOrganization = async (props: FormData) =>
  apiClient.post<Organization>("organizations", props).then((r) => r.data);

export const patchOrganization = async (id: string, props: FormData) =>
  apiClient
    .patch<Organization>("organizations/" + id, props)
    .then((r) => r.data);
