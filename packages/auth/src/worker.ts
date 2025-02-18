import { issuer } from "@openauthjs/openauth";
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare";
import { subjects } from "./subjects";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { THEME_OPENAUTH } from "@openauthjs/openauth/ui/theme";
import { Resource } from "sst/resource";
import { User } from "@plobbo/core/db/user/index";
import { getDrizzle } from "@plobbo/core/db/drizzle";
import { sendMail } from "@plobbo/core/mailer/index";
import { cors } from "hono/cors";

const allowedOrigins = [
  /^https:\/\/[a-zA-Z0-9-]+\.plobbo\.com$/,
  /^http:\/\/localhost:\d+$/,
];

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return issuer({
      theme: {
        ...THEME_OPENAUTH,
        radius: "lg",
      },
      storage: CloudflareStorage({ namespace: Resource.kv }),
      subjects,
      // eslint-disable-next-line @typescript-eslint/require-await
      allow: async () => true,
      providers: {
        code: CodeProvider(
          CodeUI({
            // eslint-disable-next-line @typescript-eslint/require-await
            sendCode: async ({ email }, code) => {
              console.log(email, code);

              try {
                ctx.waitUntil(
                  sendMail({
                    accessKeyId: env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
                    message: {
                      data: "Your login code is " + code,
                      type: "string",
                    },
                    subject: "Confirm your email address",
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it's there
                    to: { addr: email! },
                  }),
                );
              } catch (error) {
                console.error("Failed to send email:", error);
                throw error;
              }
            },
          }),
        ),
      },
      success: async (ctx, value) => {
        if (!("email" in value.claims))
          throw new Error("email missing in claims");

        const db = getDrizzle();
        let user = await User.findByEmail(db, value.claims.email);
        if (!user) user = await User.create(db, { email: value.claims.email });
        if (!user) throw new Error("Failed to create user");

        return ctx.subject("user", user);
      },
    })
      .use(
        cors({
          origin: (origin) =>
            typeof origin === "string" &&
            allowedOrigins.some((pattern) => pattern.test(origin))
              ? origin
              : "https://dash.plobbo.com",
          allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
          allowMethods: ["POST", "GET", "OPTIONS", "PUT", "PATCH", "DELETE"],
          exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
          maxAge: 600,
          credentials: true,
        }),
      )
      .fetch(request, env, ctx);
  },
};
