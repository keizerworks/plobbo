import { Hono } from "hono";

import { enforeAuthMiddleware } from "~/middlewares/auth";

const profileRouter = new Hono().use(enforeAuthMiddleware);

profileRouter.get((c) => c.json(c.var.user));

export default profileRouter;
