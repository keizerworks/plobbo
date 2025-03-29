import { getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { User } from "@plobbo/db/user/index";
import { Auth } from "@plobbo/auth";
import { Session } from "@plobbo/db/user/session";

interface Env {
  Variables: { user: User.Model };
}

export const enforeAuthMiddleware = createMiddleware<Env>(async (c, next) => {
  const token = getCookie(c, "token");
  if (!token) throw new HTTPException(401);

  const { user, session } = await Auth.validateSessionToken(token);
  if (!session) throw new HTTPException(401);

  if (session.expiresAt.getTime() - Date.now() < 10 * 60 * 1000) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    Session.update(session.id, session).catch(console.error);

    setCookie(c, "token", token, {
      path: "/",
      sameSite: "none",
      httpOnly: process.env.NODE_ENV === "production",
      domain: process.env.NODE_ENV === "production" ? ".plobbo.com" : undefined,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  c.set("user", user);
  await next();
});
