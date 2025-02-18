import { TRPCError } from "@trpc/server";

import { Blog } from "~/db/blog";
import { protectedProcedure } from "~/trpc";
import { updateBlogSchema } from "~/validators/blog/update";

export const updateBlogHandler = protectedProcedure
    .input(updateBlogSchema)
    .mutation(async ({ input }) => {
        try {
            await Blog.update(input);
            return { success: true };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update blog",
                cause: error,
            });
        }
    });
