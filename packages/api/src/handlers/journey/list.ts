import { zValidator } from "@hono/zod-validator";

import { factory } from "@plobbo/api/factory";
import { Journey } from "@plobbo/db/journey/index";
import { journeyListFilterSchema } from "@plobbo/validator/journey/list";

export const listJourneyHandler = factory.createHandlers(
  zValidator("query", journeyListFilterSchema),
  async (c) => {
    const query = c.req.valid("query");
    const journeys = await Journey.findAll(query);
    return c.json(journeys);
  },
);
