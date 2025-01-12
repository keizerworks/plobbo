import { getBlogsCount } from "repository/blog";
import { protectedOrgProcedure } from "trpc";
import { listBlogFitlerSchema } from "validators/blog/list";

export const blogCountHandler = protectedOrgProcedure
  .input(listBlogFitlerSchema.pick({ status: true }))
  .query(async ({ input, ctx: { member } }) => {
    return await getBlogsCount({
      ...input,
      organization_id: member.organization_id,
    });
  });
