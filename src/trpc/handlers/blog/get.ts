import { z } from "zod";

import { Blog } from "~/db/blog";
import { protectedOrgProcedure } from "~/trpc";

export const blogGetHandler = protectedOrgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => Blog.findById(id));
