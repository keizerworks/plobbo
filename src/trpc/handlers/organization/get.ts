import { getOrganization } from "repository/organization";
import { protectedOrgProcedure } from "trpc";

export const organizationGetHandler = protectedOrgProcedure.query(
  async ({ ctx: { member } }) => {
    return await getOrganization(member.organization_id);
  },
);
