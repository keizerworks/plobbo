import { organizationCountHandler } from "~/trpc/handlers/organization/count";
import { organizationCreateHandler } from "~/trpc/handlers/organization/create";
import { organizationGetHandler } from "~/trpc/handlers/organization/get";
import { organizationListHandler } from "~/trpc/handlers/organization/list";
import { organizationUpdateHandler } from "~/trpc/handlers/organization/update";

import { organizationMemberUpdateRouter } from "./organization-member";

export const organizationRouter = {
    get: organizationGetHandler,
    list: organizationListHandler,
    create: organizationCreateHandler,
    count: organizationCountHandler,
    update: organizationUpdateHandler,
    member: organizationMemberUpdateRouter,
};
