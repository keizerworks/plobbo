import { TRPCError } from "@trpc/server";
import { getBlogMetadata } from "repository/blog-metadata";
import { protectedOrgProcedure } from "trpc";
import { getBlogMetadataSchema } from "validators/blog-metadata/get";

export const getBlogMetadataHandler = protectedOrgProcedure
  .input(getBlogMetadataSchema) // Validating input as a string
  .query(async ({ input }) => {
    const blogMetadata = await getBlogMetadata(input); // Pass the ID

    if (!blogMetadata) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No metadata found for this blog ID",
      });
    }

    return blogMetadata;
  });
