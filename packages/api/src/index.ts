import { Hono } from "hono/quick";
import { handle } from "hono/vercel";

import aiRouter from "./routes/ai";
import blogsRouter from "./routes/blogs";
import organizationsRouter from "./routes/organizations";
import profileRouter from "./routes/user";

const app = new Hono()
  .basePath("/api")
  // .use(
  //   cors({
  //     origin: [
  //       process.env.NODE_ENV === "production"
  //         ? "https://dash.plobbo.com"
  //         : "http://localhost:3001",
  //     ],
  //     allowMethods: ["POST", "GET", "OPTIONS", "PUT", "PATCH", "DELETE"],
  //     credentials: false,
  //   }),
  // )
  .route("/profile", profileRouter)
  .route("/organizations", organizationsRouter)
  .route("/blogs", blogsRouter)
  .route("/ai", aiRouter);

export default handle(app);
export type AppType = typeof app;
