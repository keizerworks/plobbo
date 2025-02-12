import { createSubjects } from "@openauthjs/openauth/subject";
import type { InferOutput } from "valibot";
import { boolean, nullable, object, string } from "valibot";

export const subjects = createSubjects({
  user: object({
    id: string(),
    name: nullable(string()),
    email: string(),
    verified: boolean(),
  }),
});

export type Subjects = InferOutput<(typeof subjects)["user"]>;
