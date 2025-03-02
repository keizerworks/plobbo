import { createFactory } from "hono/factory";

interface Env {
  Bindings: { AUTH_URL: string };
}

export const factory = createFactory<Env>();
