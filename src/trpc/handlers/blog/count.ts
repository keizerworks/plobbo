import { Blog } from "db/blog";
import { protectedOrgProcedure } from "trpc";
import { listBlogFitlerSchema } from "validators/blog/list";

export const blogCountHandler = protectedOrgProcedure
  .input(listBlogFitlerSchema.pick({ status: true }))
  .query(async ({ input, ctx: { member } }) => {
    return await Blog.count({
      ...input,
      organization_id: member.organizationId,
    });
  });
