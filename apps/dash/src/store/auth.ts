import cookies from "js-cookie";
import { create } from "zustand";

import type { Profile } from "~/actions/profile";
import { getProfile } from "~/actions/profile";
import apiClient from "~/lib/axios";

import { createSelectors } from "./zustand";

interface VerifyOtpResponse {
  token: string;
  id: string;
  email: string;
  name: string | null;
  verified: boolean;
}

interface AuthState {
  profile?: Profile;
  loaded: boolean;
  loggedIn: boolean;
  token?: string;
  getToken: () => string | undefined;
  initialize: () => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const _useAuthStore = create<AuthState>()((set, get) => ({
  profile: undefined,
  loaded: false,
  loggedIn: false,
  token: undefined,

  initialize: async () => {
    const token = get().getToken();
    if (token) await get().fetchUser();
    set({ loaded: true });
  },

  getToken: () => {
    const token = cookies.get("token");
    if (!token) return undefined;
    set({ token, loggedIn: true });
    return token;
  },

  fetchUser: async () => {
    try {
      const profile = await getProfile();
      set({ profile, loggedIn: true });
    } catch (error) {
      console.log(error);
    }
  },

  logout: async () => {
    try {
      await logoutApi();
      set({ profile: undefined, loggedIn: false, token: undefined });
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },
}));

export const initializeAuth = _useAuthStore.getState().initialize;
export const getIsLoggedIn = () => _useAuthStore.getState().loggedIn;
export const getToken = () => _useAuthStore.getState().token;
export const logout = _useAuthStore.getState().logout;

export const useAuthStore = createSelectors(_useAuthStore);

// API functions
export async function requestOtpApi(email: string) {
  const formData = new FormData();
  formData.set("email", email);
  await apiClient.post("/auth/request-otp", formData);
}

export async function verifyOtpApi(email: string, otp: string) {
  const formData = new FormData();
  formData.set("email", email);
  formData.set("otp", otp);
  const response = await apiClient.post<VerifyOtpResponse>(
    "/auth/verify-otp",
    formData,
  );
  const { token } = response.data;
  cookies.set("token", token);
  return response.data;
}

export async function logoutApi() {
  await apiClient.post("/auth/logout");
  cookies.set("token", "", { expires: new Date() });
  window.location.replace("/");
}
