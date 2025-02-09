import { OrganizationMember } from "db/organization/member";
import { protectedProcedure } from "trpc";

export const organizationMemberListHandler = protectedProcedure.query(
  async ({ ctx: { user } }) => {
    return await OrganizationMember.findAll({ userId: user.id });
  },
);
