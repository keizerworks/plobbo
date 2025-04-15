import { z } from "zod";

export const journeyTableSchema = z.object({
  title: z.string(),
  id: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  organizationId: z.string(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const createJourneyTable = journeyTableSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type JourneyTable = z.infer<typeof journeyTableSchema>;
export type CreateJourneyTable = z.infer<typeof createJourneyTable>;
