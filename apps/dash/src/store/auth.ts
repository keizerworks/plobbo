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
  logout: () => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  getToken: () => string | undefined;
  initialize: () => Promise<void>;
  fetchUser: () => Promise<void>;
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

  requestOtp: async (email: string) => {
    await apiClient.post("/auth/request-otp", { email });
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await apiClient.post<VerifyOtpResponse>(
      "/auth/verify-otp",
      { email, otp },
    );
    const { token } = response.data;
    cookies.set("token", token);
    set({ token, loggedIn: true });
    await get().fetchUser();
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
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
      cookies.set("token", "", { expires: new Date() });
      set({ profile: undefined, loggedIn: false, token: undefined });
      window.location.replace("/");
    }
  },
}));

export const initializeAuth = _useAuthStore.getState().initialize;
export const getIsLoggedIn = () => _useAuthStore.getState().loggedIn;
export const getToken = () => _useAuthStore.getState().token;
export const requestOtp = _useAuthStore.getState().requestOtp;
export const verifyOtp = _useAuthStore.getState().verifyOtp;
export const logout = _useAuthStore.getState().logout;

export const useAuthStore = createSelectors(_useAuthStore);
