import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { ulid } from "ulid";

import { factory } from "@plobbo/api/factory";
import { uploadFile } from "@plobbo/api/lib/bucket";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforeHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import { Journey } from "@plobbo/db/journey/index";
import { createJourneySchema } from "@plobbo/validator/journey/create";

export const postJourneyHandler = factory.createHandlers(
  enforeAuthMiddleware,
  enforeHasOrgMiddleware("organizationId"),

  zValidator("form", createJourneySchema),

  async (c) => {
    const body = c.req.valid("form");
    const input: Journey.CreateInput = {
      organizaitonId: body.organizationId,
      title: body.title,
      description: body.description,
    };

    if (body.image) {
      const filename = "journey/" + encodeURI(ulid() + "-" + body.title);
      input.image = process.env.NEXT_PUBLIC_S3_DOMAIN + "/" + filename;
      await uploadFile(filename, body.image);
    }

    const journey = await Journey.create(input);
    if (!journey)
      throw new HTTPException(400, { message: "Failed to create journey" });

    return c.json(journey);
  },
);
