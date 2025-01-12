import type { DB } from "db/types";
import type { Insertable } from "kysely";
import { db } from "db";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { uuidv7 } from "uuidv7";

export type InsertOrganizationInterface = Omit<
  Insertable<DB["organization"]>,
  "id"
>;

export interface OrganizationWithInterface {
  member?: boolean;
  members?: boolean;
}

export interface OrganizationFilterInterface {
  search?: string;
  userId?: string;
}

export const insertOrganization = async (
  values: InsertOrganizationInterface,
) => {
  return await db
    .insertInto("organization")
    .values({ ...values, id: uuidv7() })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const getOrganization = async (id: string) => {
  return await db
    .selectFrom("organization")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
};

export const getOrganizationBySlug = async (slug: string) => {
  return await db
    .selectFrom("organization")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirstOrThrow();
};

export const getOrganizations = async (
  filter?: OrganizationFilterInterface,
  withRel?: OrganizationWithInterface,
) => {
  const query = db
    .selectFrom("organization")
    .select([
      "organization.updated_at",
      "organization.created_at",
      "organization.id",
      "organization.name",
      "organization.logo",
      "organization.description",
      "organization.slug",
    ])
    .$if(!!withRel?.members, (qb) =>
      qb.select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom("organization_member")
            .selectAll("organization_member")
            .whereRef(
              "organization_member.organization_id",
              "=",
              "organization.id",
            ),
        ).as("members"),
      ),
    )
    .$if(!!withRel?.member, (qb) =>
      qb.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom("organization_member")
            .selectAll("organization_member")
            .whereRef(
              "organization_member.organization_id",
              "=",
              "organization.id",
            ),
        ).as("member"),
      ),
    )
    .$if(!!filter?.search, (qb) =>
      qb.where((eb) =>
        eb.or([
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          eb("name", "ilike", `%${filter!.search!}%`),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          eb("slug", "ilike", `%${filter!.search!}%`),
        ]),
      ),
    )
    .$if(!!filter?.userId, (qb) =>
      qb
        .innerJoin(
          "organization_member",
          "organization_member.organization_id",
          "organization.id",
        )
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .where("organization_member.user_id", "=", filter!.userId!),
    );

  return await query.execute();
};

export const updateOrganization = async (
  id: string,
  values: Omit<Partial<InsertOrganizationInterface>, "id">,
) => {
  await db
    .updateTable("organization")
    .where("id", "=", id)
    .set(values)
    .executeTakeFirstOrThrow();
};

export const deleteOrganization = async (id: string) => {
  await db.deleteFrom("organization").where("id", "=", id).execute();
};

export const getOrganizationsCount = async (
  filter?: OrganizationFilterInterface,
) => {
  const result = await db
    .selectFrom("organization")
    .select((eb) => eb.fn.countAll().as("count"))
    .$if(!!filter?.search, (qb) =>
      qb.where((eb) =>
        eb.or([
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          eb("name", "ilike", `%${filter!.search!}%`),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          eb("slug", "ilike", `%${filter!.search!}%`),
        ]),
      ),
    )
    .$if(!!filter?.userId, (qb) =>
      qb
        .innerJoin(
          "organization_member",
          "organization_member.organization_id",
          "organization.id",
        )
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .where("organization_member.user_id", "=", filter!.userId!),
    )
    .executeTakeFirstOrThrow();

  return Number(result.count);
};
