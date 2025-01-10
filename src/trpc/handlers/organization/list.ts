import { getOrganizationsByUserId } from "db/actions/organization";
import { protectedProcedure } from "trpc";

export const organizationListHandler = protectedProcedure.query(
  async ({ ctx: { user } }) => {
    return (await getOrganizationsByUserId(user.id)).map((value) => ({
      ...value.organization,
      member: value.member,
    }));
  },
);
