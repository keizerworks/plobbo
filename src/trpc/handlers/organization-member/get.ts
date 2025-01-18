import { getOrganizationMember } from "repository/organization-member";
import { protectedOrgProcedure } from "trpc";

export const organizationMemberGetHandler = protectedOrgProcedure.query(
  async ({ ctx: { user, member } }) => {
    return await getOrganizationMember({
      user_id: user.id,
      organization_id: member.organization_id,
    });
  },
);
