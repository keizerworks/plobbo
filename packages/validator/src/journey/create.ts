import { z } from "zod";

export const createJourneySchema = z.object({
  organizationId: z.string(),
  image: z.instanceof(File).optional(),
  description: z.string().optional(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters long",
  }),
});

export type CreateJourneyInterface = z.infer<typeof createJourneySchema>;
