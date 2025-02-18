import { z } from "zod";

import { Blog } from "~/db/blog";
import { protectedOrgProcedure } from "~/trpc";

export const deleteMultipleBlogHandler = protectedOrgProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input }) => {
        await Promise.all(input.ids.map((id) => Blog.remove(id)));
    });

export const deleteBlogHandler = protectedOrgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
        await Blog.remove(input.id);
    });
