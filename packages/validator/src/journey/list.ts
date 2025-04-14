import { z } from "zod";

export const journeyListFilterSchema = z.object({
  organizationId: z.string(),
});

export type JourneyListFilterInterface = z.infer<
  typeof journeyListFilterSchema
>;
