import { getBlogs } from "repository/blog";
import { protectedOrgProcedure } from "trpc";
import { listBlogFitlerSchema } from "validators/blog/list";

export const blogListHandler = protectedOrgProcedure
  .input(listBlogFitlerSchema)
  .query(async ({ input, ctx: { member } }) => {
    return await getBlogs(
      { ...input, organization_id: member.organization_id },
      { author: true },
    );
  });
