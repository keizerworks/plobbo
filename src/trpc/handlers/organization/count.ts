import { Organization } from "db/organization";
import { protectedProcedure } from "trpc";

export const organizationCountHandler = protectedProcedure.query(
  async ({ ctx: { user } }) => await Organization.countByUserId(user.id),
);
