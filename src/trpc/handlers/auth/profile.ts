import { protectedProcedure } from "~/trpc";

export const profileHandler = protectedProcedure.query(
    ({ ctx: { user } }) => user,
);
