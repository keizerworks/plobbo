import { TRPCError } from "@trpc/server";

import { BlogMetadata } from "~/db/blog/metadata";
import { protectedOrgProcedure } from "~/trpc";

export const upsertBlogMetadataHandler = protectedOrgProcedure
    .input(BlogMetadata.createSchema)
    .mutation(async ({ input }) => {
        try {
            const existingMetadata = await BlogMetadata.findOne({
                blogId: input.blogId,
            });

            if (existingMetadata) {
                await BlogMetadata.update(input);
                return { message: "Metadata updated successfully" };
            }

            return {
                message: "Metadata created successfully",
                data: await BlogMetadata.create(input),
            };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to upsert blog metadata",
                cause: error,
            });
        }
    });
