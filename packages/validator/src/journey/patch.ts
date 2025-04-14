import { z } from "zod";

export const patchJourneySchema = z.object({
  image: z.instanceof(File).optional(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters long",
  }),
});

export type PatchJourneyInterface = z.infer<typeof patchJourneySchema>;
