import { TRPCError } from "@trpc/server";
import { BlogMetadata } from "db/blog/metadata";
import { protectedOrgProcedure } from "trpc";
import { getBlogMetadataSchema } from "validators/blog-metadata/get";

export const getBlogMetadataHandler = protectedOrgProcedure
  .input(getBlogMetadataSchema)
  .query(async ({ input }) => {
    const blogMetadata = await BlogMetadata.findOne(input);
    if (!blogMetadata)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No metadata found for this blog ID",
      });
    return blogMetadata;
  });
