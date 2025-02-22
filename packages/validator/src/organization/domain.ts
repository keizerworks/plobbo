import { z } from "zod";

export const requestDomainVerificationSchema = z.object({
  domain: z.string().refine(
    (val) => {
      try {
        new URL(`https://${val}`);
        return !val.startsWith("http");
      } catch {
        return false;
      }
    },
    {
      message:
        "Domain should not include protocol (http/https) and must be a valid domain",
    },
  ),
});

export type RequestDomainVerificationInterface = z.infer<
  typeof requestDomainVerificationSchema
>;
