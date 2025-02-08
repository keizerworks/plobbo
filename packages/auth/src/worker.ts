import { issuer } from "@openauthjs/openauth";
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare";
import { subjects } from "./subjects";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { THEME_OPENAUTH } from "@openauthjs/openauth/ui/theme";
import { Resource } from "sst/resource";

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return issuer({
      theme: {
        ...THEME_OPENAUTH,
        radius: "lg",
      },
      storage: CloudflareStorage({ namespace: Resource["kv"] }),
      subjects,
      // eslint-disable-next-line @typescript-eslint/require-await
      allow: async () => true,
      providers: {
        code: CodeProvider(
          CodeUI({
            // eslint-disable-next-line @typescript-eslint/require-await
            sendCode: async ({ email }, code) => {
              console.log(email, code);
              // await Email.send(
              //   email,
              //   "Confirm your email address",
              //   `Your login code is ${code}`,
              // ).catch(console.error);
            },
          }),
        ),
      },
      success: async (ctx) => {
        // const user = await getUser(value.claims.email);
        return ctx.subject("user", {
          id: "",
          email: "",
          name: "",
          verified: false,
        });
      },
    }).fetch(request, env, ctx);
  },
};
