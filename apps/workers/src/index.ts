import { Hono } from "hono";

import organizationRouter from "./routes/organization";
import profileRouter from "./routes/user";

interface Bindings {
  BUCKET: string;
  R2: R2Bucket;
}

const app = new Hono<{ Bindings: Bindings }>();

app.route("/profile", profileRouter);
app.route("/organization", organizationRouter);

export default app;
