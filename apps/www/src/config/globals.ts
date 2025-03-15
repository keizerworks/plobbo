export const globalForCustomDomain = globalThis as unknown as {
  getOrgSlugFromCustomDomain: (domain: string) => Promise<string | null>;
};
