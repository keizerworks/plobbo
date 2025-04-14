import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

import { factory } from "@plobbo/api/factory";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforeHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import { Journey } from "@plobbo/db/journey/index";
import { createJourneySchema } from "@plobbo/validator/journey/create";

export const postJourneyHandler = factory.createHandlers(
  enforeAuthMiddleware,
  enforeHasOrgMiddleware("organizationId"),

  zValidator("json", createJourneySchema),

  async (c) => {
    const body = c.req.valid("json");
    const input: Journey.CreateInput = {
      organizaitonId: body.organizationId,
      title: body.title,
    };

    const journey = await Journey.create(input);
    if (!journey)
      throw new HTTPException(400, { message: "Failed to create journey" });

    return c.json(journey);
  },
);
