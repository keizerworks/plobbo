import type { DB } from "db/types";
import type { Selectable } from "kysely";
import { getOrganizationMembers } from "repository/organization-member";
import { protectedProcedure } from "trpc";

export const organizationMemberListHandler = protectedProcedure.query(
  async ({ ctx: { user } }) => {
    return (await getOrganizationMembers({ userId: user.id })) as Selectable<
      DB["organization_member"]
    >[];
  },
);
