import { Hono } from "hono/quick";

import { enforeAuthMiddleware } from "~/middleware/auth";

const profileRouter = new Hono().use(enforeAuthMiddleware);

// eslint-disable-next-line @typescript-eslint/require-await
profileRouter.get("/", async (c) => c.json(c.var.user));

export default profileRouter;
