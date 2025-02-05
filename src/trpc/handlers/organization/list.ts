import { Organization } from "db/organization";
import { protectedProcedure } from "trpc";

export const organizationListHandler = protectedProcedure.query(
  async ({ ctx: { user } }) => {
    return await Organization.findAllByUserId(user.id);
  },
);
