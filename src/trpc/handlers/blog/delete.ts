import { deleteBlog, deleteBlogs } from "repository/blog";
import { protectedOrgProcedure } from "trpc";
import { z } from "zod";

export const deleteMultipleBlogHandler = protectedOrgProcedure
  .input(z.object({ ids: z.array(z.string()) }))
  .mutation(async ({ input }) => {
    await deleteBlogs(input.ids);
  });

export const deleteBlogHandler = protectedOrgProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    await deleteBlog(input.id);
  });
