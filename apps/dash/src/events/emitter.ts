import mitt from "mitt";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type EmitterInterface = {
  "create:org": boolean;
  "update:organizationmember": boolean;
  "update:org:refetchquerydata": undefined;
};

export const emitter = mitt<EmitterInterface>();
