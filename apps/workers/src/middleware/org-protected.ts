import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { Subjects } from "@plobbo/auth/subjects";
import type { Drizzle } from "@plobbo/core/db/drizzle";
import type { Organization } from "@plobbo/core/db/organization/index";
import type { OrganizationMember } from "@plobbo/core/db/organization/member";
import {
  and,
  eq,
  getDrizzle,
  getTableColumns,
  sql,
} from "@plobbo/core/db/drizzle";
import {
  OrganizationMemberTable,
  OrganizationTable,
} from "@plobbo/core/db/organization/organization.sql";

interface Env {
  Variables: {
    user: Subjects;
    db: Drizzle;
    organization: Organization.Model & {
      member: OrganizationMember.Model;
    };
  };
}

export const enforeHasOrgMiddleware = createMiddleware<Env>(async (c, next) => {
  const user = c.var.user;
  const parsedBody = await c.req.parseBody();
  const organizationId = parsedBody.organizationId ?? parsedBody.id;

  if (typeof organizationId !== "string") {
    throw new HTTPException(400, {
      message: "organizationId is required in request body",
    });
  }

  const db = getDrizzle();

  let organization: Env["Variables"]["organization"] | undefined;
  try {
    const res = (
      await db
        .select({
          ...getTableColumns(OrganizationTable),
          member: sql<string>`
						json_object(
							'id', ${OrganizationMemberTable.id},
							'organizationId', ${OrganizationMemberTable.organizationId},
							'userId', ${OrganizationMemberTable.userId},
							'role', ${OrganizationMemberTable.role},
							'createdAt', ${OrganizationMemberTable.createdAt},
							'updatedAt', ${OrganizationMemberTable.updatedAt}
						)
					`.as("member"),
        })
        .from(OrganizationTable)
        .innerJoin(
          OrganizationMemberTable,
          eq(OrganizationTable.id, OrganizationMemberTable.organizationId),
        )
        .where(
          and(
            eq(OrganizationTable.id, organizationId),
            eq(OrganizationMemberTable.userId, user.id),
          ),
        )
    )[0];

    if (res)
      organization = {
        ...res,
        member: JSON.parse(res.member) as OrganizationMember.Model,
      };
  } catch (e) {
    console.error(e);
    throw new HTTPException(500, {
      message: "Something went wrong!",
    });
  }

  if (!organization) {
    throw new HTTPException(403, {
      message: "You are not a member of this organization",
    });
  }

  c.set("organization", organization);
  c.set("db", db);

  await next();
});
