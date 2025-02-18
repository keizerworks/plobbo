import type { StateStorage } from "zustand/middleware";
import cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createSelectors } from "./zustand";

interface ActiveOrgInterface {
  id: string | null;
  set: (v: string | null) => void;
}

const storage: StateStorage = {
  getItem: (name) => cookies.get(name) ?? null,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  setItem: cookies.set,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  removeItem: cookies.remove,
};

export const _useActiveOrgStore = create<ActiveOrgInterface>()(
  persist(
    (set) => ({
      id: null,
      set: (id) => set({ id }),
    }),
    {
      name: "active-org-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);

export const getActiveOrgId = () => _useActiveOrgStore.getState().id;
export const setActiveOrgId = _useActiveOrgStore.getState().set;

export const useActiveOrgStore = createSelectors(_useActiveOrgStore);
