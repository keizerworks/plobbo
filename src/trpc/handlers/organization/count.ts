import { getOrganizationsCount } from "repository/organization";
import { protectedProcedure } from "trpc";

export const organizationCountHandler = protectedProcedure.query(
  async ({ ctx: { user } }) => await getOrganizationsCount({ userId: user.id }),
);
