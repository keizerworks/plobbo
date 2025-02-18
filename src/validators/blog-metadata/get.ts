import { z } from "zod";

export const getBlogMetadataSchema = z.union([
    z.object({ id: z.string() }),
    z.object({ blogId: z.string() }),
]);
