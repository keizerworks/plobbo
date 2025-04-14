import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforeHasJourneyMiddleware } from "@plobbo/api/middleware/journey-protected";
import { Journey } from "@plobbo/db/journey/index";
import { patchJourneySchema } from "@plobbo/validator/journey/patch";

export const patchJourneyHandler = factory.createHandlers(
  enforeAuthMiddleware,
  enforeHasJourneyMiddleware,

  zValidator("json", patchJourneySchema),
  zValidator("param", z.object({ journeyId: z.string() })),

  async (c) => {
    const body = c.req.valid("json");
    const journey = c.var.journey;

    const updatedJourney = await Journey.update({ ...journey, ...body });
    if (!updatedJourney)
      throw new HTTPException(400, { message: "Failed to update journey" });

    return c.json(updatedJourney);
  },
);
