import type { Organization } from "~/types/organization";
import apiClient from "~/lib/axios";

export const getOrganizations = async () =>
  apiClient.get<Organization[]>("organizations").then((r) => r.data);

export const createOrganization = async (props: FormData) =>
  apiClient.post<Organization>("organizations", props).then((r) => r.data);

export const patchOrganization = async (props: FormData) =>
  apiClient.patch<Organization>("organizations", props).then((r) => r.data);
