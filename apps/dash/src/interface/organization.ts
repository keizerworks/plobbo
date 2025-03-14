import type { MemberRoleEnum } from "@plobbo/validator/organization-member/enum";

export interface OrganizationMember {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
  organizationId: string;
  role: MemberRoleEnum;
  profilePicture: string | null;
  bio: string | null;
  displayName: string | null;
}

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
