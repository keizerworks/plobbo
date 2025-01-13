import type { DB } from "db/types";
import type { Selectable } from "kysely";
import { getOrganizations } from "repository/organization";
import { protectedProcedure } from "trpc";

export const organizationListHandler = protectedProcedure.query(
  async ({ ctx: { user } }) => {
    return (await getOrganizations({ userId: user.id })) as Selectable<
      DB["organization"]
    >[];
  },
);
