import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { Journey } from "@plobbo/db/journey/index";

export const getJourneyHandler = factory.createHandlers(
  zValidator("param", z.object({ journeyId: z.string() })),
  async (c) => {
    const journey = await Journey.findById(c.req.valid("param").journeyId);
    if (!journey)
      throw new HTTPException(400, { message: "Failed to create journey" });
    return c.json(journey);
  },
);
