import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { Subjects } from "@plobbo/auth/subjects";
import { client } from "@plobbo/auth/client";
import { subjects } from "@plobbo/auth/subjects";

interface Env {
  Variables: {
    user: Subjects;
  };
  Bindings: {
    BUCKET: string;
    R2: R2Bucket;
  };
}

export const enforeAuthMiddleware = createMiddleware<Env>(async (c, next) => {
  const sessionToken = getCookie(c, "session");
  if (!sessionToken) return c.status(401);
  const verified = await client.verify(subjects, sessionToken);
  if (verified.err) throw new HTTPException(401, verified.err);

  c.set("user", verified.subject.properties);
  await next();
});
