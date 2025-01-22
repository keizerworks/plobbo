import { getBlog } from "repository/blog";
import { protectedOrgProcedure } from "trpc";
import { z } from "zod";

export const blogGetHandler = protectedOrgProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input: { id } }) => getBlog(id));
