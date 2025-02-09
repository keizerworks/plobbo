import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { Blog } from "db/blog";
import { BlogMetadata } from "db/blog/metadata";
import { getSignedUrlPutObject } from "storage";
import { protectedOrgProcedure } from "trpc";
import { createBlogMutationSchema } from "validators/blog/create";

export const createBlogHandler = protectedOrgProcedure
  .input(createBlogMutationSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const filename = encodeURI(`${createId()}-${input.slug}`);
      const imageUrl = `blogs/${filename}`;

      const blog = await Blog.create({
        slug: input.slug,
        body: input.body ?? [],
        image: imageUrl,
        tags: input.tags,
        status: input.status,
        organizationId: ctx.member.organizationId,
        authorId: ctx.member.id,
      });

      if (!blog) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create blog",
        });
      }

      await BlogMetadata.update({
        blogId: blog.id,
        title: input.title,
        description: "",
      });

      const imageUploadUrl = await getSignedUrlPutObject({
        filename,
      });

      return { blog, imageUploadUrl };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create blog",
        cause: error,
      });
    }
  });
