import type { RequestDomainVerificationInterface } from "@plobbo/validator/organization/domain";

import apiClient from "~/lib/axios";

interface OrganizationDomainResponse {
  recordName: string;
  cloudfrontTarget: string;
  resourceRecord: { Name: string; Type: string; Value: string } | undefined;
  organizationId: string;
  domain: string;
  verified: boolean;
  cnameVerified: boolean;
  certificateArn: string;
}

export async function getDomainSettings(id: string) {
  return apiClient
    .get<
      OrganizationDomainResponse | undefined
    >("organizations/" + id + "/domain")
    .then((r) => r.data);
}

interface RequestDomainVerificationResponse {
  message: string;
  recordName: string;
  recordValue: string;
}

export async function requestDomainVerification(
  id: string,
  values: RequestDomainVerificationInterface,
) {
  const formData = new FormData();
  formData.set("domain", values.domain);

  return apiClient
    .post<RequestDomainVerificationResponse>(
      "organizations/" + id + "/domain/request-verification",
      formData,
    )
    .then((r) => r.data);
}

export async function verifyDomain(id: string) {
  return apiClient
    .post<{ message: string }>("organizations/" + id + "/domain/verify")
    .then((r) => r.data);
}

export async function verifyDomainCname(id: string) {
  return apiClient
    .post<{ message: string }>("organizations/" + id + "/domain/verify-cname")
    .then((r) => r.data);
}
