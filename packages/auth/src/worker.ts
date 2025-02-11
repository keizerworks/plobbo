import { issuer } from "@openauthjs/openauth";
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare";
import { subjects } from "./subjects";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { THEME_OPENAUTH } from "@openauthjs/openauth/ui/theme";
import { Resource } from "sst/resource";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { User } from "@plobbo/core/db/user/index";
import { getDrizzle } from "@plobbo/core/db/index";

interface SendEmailQueue {
  to: string;
  subject: string;
  body: string;
  type: "text" | "html";
}

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
                const sqs = new SQSClient();
                ctx.waitUntil(
                  sqs.send(
                    new SendMessageCommand({
                      QueueUrl: Resource.queue.url,
                      MessageBody: JSON.stringify({
                        body: "Your login code is " + code,
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it's there
                        to: email!,
                        type: "text",
                        subject: "Confirm your email address",
                      } satisfies SendEmailQueue),
                    }),
                  ),
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
    }).fetch(request, env, ctx);
  },
};
