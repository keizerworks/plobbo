import { TRPCError } from "@trpc/server";
import {
  deletedEmailVerificationRequestByEmail,
  getEmailVerificationRequestByEmail,
} from "db/actions/email-verification";
import { updateUser } from "db/actions/user";
import { publicProcedure } from "trpc";
import { verifyEmailSchema } from "validators/auth";

export const verifyEmailHandler = publicProcedure
  .input(verifyEmailSchema)
  .mutation(async ({ input: body }) => {
    const verificationRequest = await getEmailVerificationRequestByEmail(
      body.email,
    );

    if (!verificationRequest)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "No verification request found for this email. Please sign up again.",
      });

    if (Date.now() > verificationRequest.expiresAt.getTime())
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "The OTP has expired. Please request a new verification code.",
      });

    const updateUserPayload = { emailVerified: true };
    await updateUser(verificationRequest.userId, updateUserPayload);
    deletedEmailVerificationRequestByEmail(body.email).catch(console.error);

    return {
      message:
        "Your email has been successfully verified. You can now sign in.",
    };
  });
