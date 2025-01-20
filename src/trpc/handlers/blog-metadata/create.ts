import { TRPCError } from "@trpc/server";
import { insertBlogMetadata } from "repository/blog-metadata";
import { protectedProcedure } from "trpc";
import { createBlogMetadataSchema } from "validators/blog-metadata/create";

export const createBlogMetadataHandler = protectedProcedure
  .input(createBlogMetadataSchema)
  .mutation(async ({ input }) => {
    try {
      const metadata = await insertBlogMetadata(input);
      return { metadata };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create blog metadata",
        cause: error,
      });
    }
  });