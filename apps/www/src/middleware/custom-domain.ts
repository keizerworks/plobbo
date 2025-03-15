import customDomainWrapper from "@opennextjs/aws/overrides/wrappers/aws-lambda-streaming.js";

import { getOrgSlugFromCustomDomain } from "~/actions/custom-domain";
import { globalForCustomDomain } from "~/config/globals";

globalForCustomDomain.getOrgSlugFromCustomDomain = getOrgSlugFromCustomDomain;

export default customDomainWrapper;
