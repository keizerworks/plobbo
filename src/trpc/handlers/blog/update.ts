import { TRPCError } from "@trpc/server";
import { updateBlog } from "repository/blog";
import { protectedProcedure } from "trpc";
import { updateBlogSchema } from "validators/blog/update";

export const updateBlogHandler = protectedProcedure
  .input(updateBlogSchema)
  .mutation(async ({ input }) => {
    try {
      const { id, ...values } = input;
      await updateBlog(id, values);
      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update blog",
        cause: error,
      });
    }
  });
