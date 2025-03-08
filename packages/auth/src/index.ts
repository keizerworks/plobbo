import { issuer } from "@openauthjs/openauth";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { THEME_OPENAUTH } from "@openauthjs/openauth/ui/theme";
import { handle } from "hono/aws-lambda";

import { sendMail } from "@plobbo/core/mailer/index";
import { User } from "@plobbo/db/user/index";
import { Waitlist } from "@plobbo/db/user/waitlist";

import { subjects } from "./subjects";

const app = issuer({
  theme: {
    ...THEME_OPENAUTH,
    radius: "lg",
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  allow: async () => true,
  subjects,
  providers: {
    code: CodeProvider(
      CodeUI({
        sendCode: async ({ email }, code) => {
          if (!email) throw new Error("Email is required");

          const waitlistRecord = await Waitlist.findOne({ email });
          if (!waitlistRecord?.approved)
            throw new Error("User not approved for access");

          try {
            await sendMail({
              message: { data: "Your login code is " + code, type: "string" },
              subject: "Confirm your email address",
              to: { addr: email },
            });
          } catch (error) {
            console.error("Failed to send email:", error);
            throw error;
          }
        },
      }),
    ),
  },
  success: async (ctx, value) => {
    if (!("email" in value.claims)) throw new Error("email missing in claims");
    let user = await User.findByEmail(value.claims.email);
    if (!user) user = await User.create({ email: value.claims.email });
    if (!user) throw new Error("Failed to create user");

    return ctx.subject("user", user);
  },
});

export const handler = handle(app);
