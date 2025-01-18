import { organizationMemberGetHandler } from "trpc/handlers/organization-member/get";
import { organizationMemberListHandler } from "trpc/handlers/organization-member/list";
import { organizationMemberUpdateHandler } from "trpc/handlers/organization-member/update";

export const organizationMemberUpdateRouter = {
  update: organizationMemberUpdateHandler,
  list: organizationMemberListHandler,
  get: organizationMemberGetHandler,
};
