import type { StateStorage } from "zustand/middleware";
import cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Organization } from "~/interface/organization";
import type { OrganizationSubscription } from "~/interface/subscription";

import { createSelectors } from "./zustand";

interface ActiveOrgIdInterface {
  id: string | null;
  set: (v: string | null) => void;
}

interface ActiveOrgInterface {
  data:
    | (Organization & { subscription: OrganizationSubscription | null })
    | null;
  set: (data: ActiveOrgInterface["data"]) => void;
}

const storage: StateStorage = {
  getItem: (name) => cookies.get(name) ?? null,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  setItem: cookies.set,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  removeItem: cookies.remove,
};

export const _useActiveOrgIdStore = create<ActiveOrgIdInterface>()(
  persist((set) => ({ id: null, set: (id) => set({ id }) }), {
    name: "active-org-storage",
    storage: createJSONStorage(() => storage),
  }),
);

export const _useActiveOrgStore = create<ActiveOrgInterface>((set) => ({
  data: null,
  set: (data) => set({ data }),
}));

export const getActiveOrgId = () => _useActiveOrgIdStore.getState().id;
export const setActiveOrgId = _useActiveOrgIdStore.getState().set;

export const getActiveOrg = () => _useActiveOrgStore.getState().data;
export const setActiveOrg = _useActiveOrgStore.getState().set;

export const useActiveOrgIdStore = createSelectors(_useActiveOrgIdStore);
export const useActiveOrgStore = createSelectors(_useActiveOrgStore);
