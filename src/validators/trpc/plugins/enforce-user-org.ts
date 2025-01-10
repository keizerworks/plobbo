import { z } from "zod";

export const inputWithOrgId = z.object({ orgId: z.string() }).passthrough();
