import { Blog } from "db/blog";
import { protectedOrgProcedure } from "trpc";
import { listBlogSortFilterSchema } from "validators/blog/list";

export const blogListHandler = protectedOrgProcedure
  .input(listBlogSortFilterSchema)
  .query(async ({ input, ctx: { member } }) => {
    return await Blog.findAll({
      ...input,
      filter: { ...input.filter, organization_id: member.organizationId },
    });
  });
