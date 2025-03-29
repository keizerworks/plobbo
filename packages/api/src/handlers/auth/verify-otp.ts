import { zValidator } from "@hono/zod-validator";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { Auth } from "@plobbo/auth";
import { OtpCache } from "@plobbo/cache/lib/otp";
import { User } from "@plobbo/db/user/index";

export const postVerifyOtpHandler = factory.createHandlers(
  zValidator(
    "form",
    z.object({ email: z.string().email(), otp: z.string().length(6) }),
  ),

  async (c) => {
    const { email, otp } = c.req.valid("form");

    const user = await User.findByEmail(email);
    if (!user) {
      throw new HTTPException(404);
    }

    const storedOtp = await OtpCache.get(email);

    if (!storedOtp) {
      console.warn(`OTP not found or expired for ${email}`);
      throw new HTTPException(400, { message: "OTP not found or expired" });
    }

    const isValid = storedOtp === otp;
    if (isValid) {
      await OtpCache.del(email);
      console.log(`OTP verified for ${email}`);
    } else {
      console.warn(`Invalid OTP for ${email}`);
    }

    const token = Auth.generateSessionToken();
    await Auth.createSession(token, user.id);

    setCookie(c, "token", token, {
      path: "/",
      sameSite: "none",
      httpOnly: process.env.NODE_ENV === "production",
      domain: process.env.NODE_ENV === "production" ? ".plobbo.com" : undefined,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json(user);
  },
);
