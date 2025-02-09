import { Organization } from "db/organization";
import { protectedOrgProcedure } from "trpc";

export const organizationGetHandler = protectedOrgProcedure.query(
  async ({ ctx: { member } }) => {
    return await Organization.findById(member.organizationId);
  },
);
