import type { StateStorage } from "zustand/middleware";
import {
  deleteActiveOrg,
  getActiveOrg,
  setActiveOrg,
} from "actions/cookies/active-org";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createSelectors } from "./zustand";

interface ActiveOrgInterface {
  id: string | null | undefined;
  set: (v: string | null) => void;
}

const storage: StateStorage = {
  getItem: async (): Promise<string | null> => {
    const id = await getActiveOrg();
    if (!id) setActiveOrgId(null);
    return id ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, "with value", value, "has been saved");
    await setActiveOrg(value);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted");
    await deleteActiveOrg();
  },
};

export const _useActiveOrgStore = create<ActiveOrgInterface>()(
  persist(
    (set) => ({
      id: undefined,
      set: (id) => set({ id }),
    }),
    {
      name: "active-org-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);

export const setActiveOrgId = _useActiveOrgStore.getState().set;
export const useActiveOrgStore = createSelectors(_useActiveOrgStore);
