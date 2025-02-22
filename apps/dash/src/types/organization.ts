export interface Organization {
  name: string;
  slug: string;
  description: string | null;
  logo: string;
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface OrganizationDomain {
  organizationId: string;
  domain: string;
  verified: boolean;
  cnameVerified: boolean;
  token: string;
}
