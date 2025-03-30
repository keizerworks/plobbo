import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { generateOtp } from "@plobbo/api/lib/utils";
import { OtpCache } from "@plobbo/cache/lib/otp";
import { sendMail } from "@plobbo/core/mailer/index";
import { User } from "@plobbo/db/user/index";

export const postRequestOtpHanlder = factory.createHandlers(
  zValidator("form", z.object({ email: z.string().email() })),
  async (c) => {
    const { email } = c.req.valid("form");

    let user = await User.findByEmail(email);
    if (!user) user = await User.create({ email: email, name: "" });

    if (!user) {
      throw new HTTPException(500, { message: "Failed to create user" });
    }

    const code = generateOtp(6);
    await sendMail({
      to: { addr: email },
      subject: "Confirm your mail address",
      message: { type: "string", data: "Your login code is " + code },
    });

    const ttl = 10 * 60;
    await OtpCache.set(email, code, ttl);

    return c.json({ message: `OTP is being sent to ${email}` });
  },
);
