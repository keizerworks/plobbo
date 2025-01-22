import { getBlogs } from "repository/blog";
import { protectedOrgProcedure } from "trpc";
import { listBlogSortFilterSchema } from "validators/blog/list";

export const blogListHandler = protectedOrgProcedure
  .input(listBlogSortFilterSchema)
  .query(async ({ input, ctx: { member } }) => {
    return await getBlogs(
      {
        ...input,
        filter: { ...input.filter, organization_id: member.organization_id },
      },
      { author: true, metadata: true },
    );
  });
