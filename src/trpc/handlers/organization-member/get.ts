import { OrganizationMember } from "db/organization/member";
import { protectedOrgProcedure } from "trpc";

export const organizationMemberGetHandler = protectedOrgProcedure.query(
  async ({ ctx: { user, member } }) => {
    return await OrganizationMember.findOne({
      userId: user.id,
      organizationId: member.organizationId,
    });
  },
);
