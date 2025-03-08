"use server";

import { DatabaseError } from "@plobbo/db/pg";
import { Waitlist } from "@plobbo/db/user/waitlist";

export const joinWaitlistAction = async (email: string) => {
  try {
    await Waitlist.create({ email });
    return { success: true };
  } catch (e) {
    if (e instanceof DatabaseError && e.code === "23505")
      return {
        error:
          "This email address has already been registered for the waitlist",
      };
    return { error: "Something went wrong. Please try again later." };
  }
};
