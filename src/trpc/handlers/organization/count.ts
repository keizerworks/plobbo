import { getOrganizationCountByUserId } from "db/actions/organization";
import { protectedProcedure } from "trpc";

export const organizationCountHandler = protectedProcedure.query(
  async ({ ctx: { user } }) => await getOrganizationCountByUserId(user.id),
);
