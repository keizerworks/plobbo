import { z } from "zod";

export const inputWithOrgId = z
  .object({ organization_id: z.string() })
  .passthrough();
