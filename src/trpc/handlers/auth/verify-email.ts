import { TRPCError } from "@trpc/server";

import { EmailVerificationRequest } from "~/db/email-verification";
import { User } from "~/db/user";
import { publicProcedure } from "~/trpc";
import { verifyEmailSchema } from "~/validators/auth";

export const verifyEmailHandler = publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ input: body }) => {
        const verificationRequest = await EmailVerificationRequest.findByEmail(
            body.email,
        );

        if (!verificationRequest) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                    "No verification request found for this email. Please sign up again.",
            });
        }

        if (Date.now() > verificationRequest.expiresAt.getTime()) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                    "The OTP has expired. Please request a new verification code.",
            });
        }

        await Promise.all([
            User.update(verificationRequest.userId, { emailVerified: true }),
            EmailVerificationRequest.remove(verificationRequest.id).catch(
                console.error,
            ),
        ]);

        return {
            message:
                "Your email has been successfully verified. You can now sign in.",
        };
    });
