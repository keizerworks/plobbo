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
