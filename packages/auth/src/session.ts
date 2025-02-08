import { auth } from "sst/auth";

export const session = auth.sessions<{
  user: {
    id: string;
    name?: string;
    email: string;
    verified: boolean;
  };
}>();
