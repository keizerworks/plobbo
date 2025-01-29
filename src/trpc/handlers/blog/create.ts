import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { insertBlog } from "repository/blog";
import { insertBlogMetadata } from "repository/blog-metadata";
import { getSignedUrlPutObject } from "storage";
import { protectedOrgProcedure } from "trpc";
import { createBlogMutationSchema } from "validators/blog/create";

export const createBlogHandler = protectedOrgProcedure
  .input(createBlogMutationSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const filename = encodeURI(`${createId()}-${input.slug}`);
      const imageUrl = `blogs/${filename}`;

      let blog;
      try {
        blog = await insertBlog({
          slug: input.slug,
          body: input.body ?? [],
          image: imageUrl,
          tags: input.tags,
          status: input.status,
          organization_id: ctx.member.organization_id,
          author_id: ctx.member.id,
        });

        await insertBlogMetadata({
          blog_id: blog.id,
          title: input.title,
          description: "",
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

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
