import type { DB } from "db/types";
import type { Insertable } from "kysely";
import { db } from "db";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { uuidv7 } from "uuidv7";

export type InsertOrganizationMemberInterface = Omit<
  Insertable<DB["organization_member"]>,
  "id"
>;

export interface OrganizationMemberWithInterface {
  user?: boolean;
  organization?: boolean;
}

export interface OrganizationMemberFilterInterface {
  userId?: string;
  organizationId?: string;
}

export const insertOrganizationMember = async (
  values: InsertOrganizationMemberInterface,
) => {
  return await db
    .insertInto("organization_member")
    .values({ ...values, id: uuidv7() })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const getOrganizationMember = async (
  props: { id: string } | { user_id: string; organization_id: string },
) => {
  return await db
    .selectFrom("organization_member")
    .selectAll()
    .$if("id" in props, (qb) =>
      qb.where("organization_member.id", "=", (props as { id: string }).id),
    )
    .$if("userId" in props, (qb) =>
      qb
        .where(
          "organization_member.user_id",
          "=",
          (props as { user_id: string; organization_id: string }).user_id,
        )
        .where(
          "organization_member.organization_id",
          "=",
          (props as { user_id: string; organization_id: string })
            .organization_id,
        ),
    )
    .executeTakeFirst();
};

export const getOrganizationMembers = async (
  filter?: OrganizationMemberFilterInterface,
  withRel?: OrganizationMemberWithInterface,
) => {
  const query = db
    .selectFrom("organization_member")
    .select([
      "organization_member.updated_at",
      "organization_member.created_at",
      "organization_member.id",
      "organization_member.role",
      "organization_member.user_id",
      "organization_member.organization_id",
    ])
    .$if(!!withRel?.user, (qb) =>
      qb.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom("user")
            .selectAll("user")
            .whereRef("user.id", "=", "organization_member.user_id"),
        ).as("user"),
      ),
    )
    .$if(!!withRel?.organization, (qb) =>
      qb.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom("organization")
            .selectAll("organization")
            .whereRef(
              "organization.id",
              "=",
              "organization_member.organization_id",
            ),
        ).as("organization"),
      ),
    )
    .$if(!!filter?.userId, (qb) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      qb.where("organization_member.user_id", "=", filter!.userId!),
    )
    .$if(!!filter?.organizationId, (qb) =>
      qb.where(
        "organization_member.organization_id",
        "=",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        filter!.organizationId!,
      ),
    );

  return await query.execute();
};

export const getOrganizationMemberByUserAndOrg = async (
  userId: string,
  organizationId: string,
) => {
  return await db
    .selectFrom("organization_member")
    .selectAll()
    .where("user_id", "=", userId)
    .where("organization_id", "=", organizationId)
    .executeTakeFirst();
};

export const updateOrganizationMember = async (
  id: string,
  values: Omit<Partial<InsertOrganizationMemberInterface>, "id">,
) => {
  await db
    .updateTable("organization_member")
    .where("id", "=", id)
    .set(values)
    .executeTakeFirstOrThrow();
};

export const deleteOrganizationMember = async (id: string) => {
  await db.deleteFrom("organization_member").where("id", "=", id).execute();
};

export const deleteOrganizationMembers = async (organizationId: string) => {
  await db
    .deleteFrom("organization_member")
    .where("organization_id", "=", organizationId)
    .execute();
};
