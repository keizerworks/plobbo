import { Blog } from "db/blog";
import { protectedOrgProcedure } from "trpc";
import { z } from "zod";

export const blogGetHandler = protectedOrgProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input: { id } }) => Blog.findById(id));
