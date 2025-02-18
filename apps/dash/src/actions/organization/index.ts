import type { Organization } from "~/types/organization";
import workersClient from "~/lib/axios";

export const getOrganizations = async () =>
  workersClient.get<Organization[]>("organizations").then((r) => r.data);

export const createOrganization = async (props: FormData) =>
  workersClient.post<Organization>("organizations", props).then((r) => r.data);

export const patchOrganization = async (props: FormData) =>
  workersClient.patch<Organization>("organizations", props).then((r) => r.data);
