import { z } from "zod";

export const patchJourneySchema = z.object({
  image: z.instanceof(File).optional(),
  description: z.string().optional(),
  title: z.string(),
});

export type PatchJourneyInterface = z.infer<typeof patchJourneySchema>;
