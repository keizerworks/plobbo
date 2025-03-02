import { factory } from "@plobbo/api/factory";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";

const getProfileHandler = factory.createHandlers(
  enforeAuthMiddleware,
  // eslint-disable-next-line @typescript-eslint/require-await
  async (c) => c.json(c.var.user),
);

export default getProfileHandler;
