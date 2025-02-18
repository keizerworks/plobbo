import cookies from "js-cookie";
import { create } from "zustand";

import type { Profile } from "~/actions/profile";
import { getProfile } from "~/actions/profile";

import { client } from "../lib/auth/client";
import { createSelectors } from "./zustand";

interface AuthState {
  profile?: Profile;
  loaded: boolean;
  loggedIn: boolean;
  token?: string;
  logout: () => void;
  login: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
  initialize: () => Promise<void>;
  refreshTokens: () => Promise<string | undefined>;
  fetchUser: () => Promise<void>;
  handleCallback: (code: string, state: string) => Promise<void>;
}

export const _useAuthStore = create<AuthState>()((set, get) => ({
  profile: undefined,
  loaded: false,
  loggedIn: false,
  token: undefined,

  initialize: async () => {
    const hash = new URLSearchParams(location.search.slice(1));
    const code = hash.get("code");
    const state = hash.get("state");
    if (code && state) return await get().handleCallback(code, state);

    const token = await get().refreshTokens();
    if (token) await get().fetchUser();

    set({ loaded: true });
  },

  refreshTokens: async () => {
    const refresh = cookies.get("refresh");
    if (!refresh) return;

    const currentToken = get().token;
    const next = await client.refresh(refresh, { access: currentToken });
    if (next.err) return;
    if (!next.tokens) return currentToken;

    cookies.set("refresh", next.tokens.refresh);
    set({ token: next.tokens.access, loggedIn: true });
    return next.tokens.access;
  },

  getToken: async () => {
    const token = await get().refreshTokens();
    if (!token) {
      await get().login();
      return;
    }
    return token;
  },

  login: async () => {
    const { challenge, url } = await client.authorize(location.origin, "code", {
      pkce: true,
    });
    sessionStorage.setItem("challenge", JSON.stringify(challenge));
    location.href = url;
    await new Promise((r) => setTimeout(r, 5000));
  },

  handleCallback: async (code: string, state: string) => {
    console.log("callback", code, state);
    const challenge = JSON.parse(
      sessionStorage.getItem("challenge") as never,
    ) as { state: string; verifier: string };

    if (code && state === challenge.state && challenge.verifier) {
      const exchanged = await client.exchange(
        code,
        location.origin,
        challenge.verifier,
      );

      if (!exchanged.err) {
        set({ token: exchanged.tokens.access, loggedIn: true });
        cookies.set("refresh", exchanged.tokens.refresh);
      }
    }
    window.location.replace("/");
  },

  fetchUser: async () => {
    try {
      const profile = await getProfile();
      set({ profile, loggedIn: true });
    } catch (error) {
      console.log(error);
    }
  },

  logout: () => {
    cookies.set("refresh", "", { expires: new Date() });
    set({ profile: undefined, loggedIn: false, token: undefined });
    window.location.replace("/");
  },
}));

export const initializeAuth = _useAuthStore.getState().initialize;
export const getIsLoggedIn = () => _useAuthStore.getState().loggedIn;
export const getToken = () => _useAuthStore.getState().token;
export const login = _useAuthStore.getState().login;
export const logout = _useAuthStore.getState().logout;

export const useAuthStore = createSelectors(_useAuthStore);
