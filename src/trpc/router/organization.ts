import { organizationListHandler } from "trpc/handlers/organization/list";

export const organizationRouter = {
  list: organizationListHandler,
};
