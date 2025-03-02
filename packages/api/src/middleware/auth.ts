import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { Subjects } from "@plobbo/auth/subjects";
import { client } from "@plobbo/auth/client";
import { subjects } from "@plobbo/auth/subjects";

interface Env {
  Variables: { user: Subjects };
}

export const enforeAuthMiddleware = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) throw new HTTPException(401);
  const token = authHeader.split(" ")[1];
  if (!token) throw new HTTPException(401);
  const verified = await client.verify(subjects, token);
  if (verified.err) throw new HTTPException(401, verified.err);
  c.set("user", verified.subject.properties);
  await next();
});
