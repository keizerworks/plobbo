import { TRPCError } from "@trpc/server";
import { updateBlogMetadata } from "repository/blog-metadata";
import { protectedProcedure } from "trpc";
import { updateBlogMetadataSchema } from "validators/blog-metadata/update";

export const updateBlogMetadataHandler = protectedProcedure
  .input(updateBlogMetadataSchema)
  .mutation(async ({ input }) => {
    try {
      const { blog_id, ...values } = input;
      await updateBlogMetadata(blog_id, values);
      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update blog metadata",
        cause: error,
      });
    }
  });