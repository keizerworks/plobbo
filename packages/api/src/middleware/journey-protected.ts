/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { Subjects } from "@plobbo/auth/subjects";
import { and, db, eq } from "@plobbo/db";
import { Journey } from "@plobbo/db/journey/index";
import { JourneyTable } from "@plobbo/db/journey/journey.sql";
import {
  OrganizationMemberTable,
  OrganizationTable,
} from "@plobbo/db/organization/organization.sql";

interface Env {
  Variables: {
    user: Subjects;
    journey: Journey.Model;
  };
}

export const enforeHasJourneyMiddleware = createMiddleware<Env>(
  async (c, next) => {
    const user = c.var.user;
    const journeyId = c.req.param("journeyId")!;

    let record;
    try {
      record = (
        await db
          .select({ ...Journey.columns })
          .from(JourneyTable)
          .innerJoin(
            OrganizationTable,
            eq(OrganizationTable.id, JourneyTable.organizaitonId),
          )
          .innerJoin(
            OrganizationMemberTable,
            eq(OrganizationMemberTable.organizationId, OrganizationTable.id),
          )
          .where(
            and(
              eq(JourneyTable.id, journeyId),
              eq(OrganizationMemberTable.userId, user.id),
            ),
          )
      )[0];
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Something went wrong!",
      });
    }

    if (!record) {
      throw new HTTPException(403, {
        message: "Journey not found or you don't have access to it",
      });
    }

    c.set("journey", record);
    await next();
  },
);
