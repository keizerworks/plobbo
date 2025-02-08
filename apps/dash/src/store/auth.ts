import { create } from "zustand";

import { client } from "../lib/auth/client";

interface AuthState {
  userId?: string;
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

export const useAuthStore = create<AuthState>()((set, get) => ({
  userId: undefined,
  loaded: false,
  loggedIn: false,
  token: undefined,

  initialize: async () => {
    const hash = new URLSearchParams(location.search.slice(1));
    const code = hash.get("code");
    const state = hash.get("state");
    console.log("initialize", code, state);

    if (code && state) {
      await get().handleCallback(code, state);
      return;
    }

    const token = await get().refreshTokens();
    console.log("token", token);
    if (token) {
      await get().fetchUser();
    }
    set({ loaded: true });
  },

  refreshTokens: async () => {
    const refresh = localStorage.getItem("refresh");
    const currentToken = get().token;

    if (!refresh) return;

    const next = await client.refresh(refresh, {
      access: currentToken,
    });

    if (next.err) return;
    if (!next.tokens) return currentToken;

    localStorage.setItem("refresh", next.tokens.refresh);
    set({ token: next.tokens.access });
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
        set({ token: exchanged.tokens.access });
        localStorage.setItem("refresh", exchanged.tokens.refresh);
      }
    }
    window.location.replace("/");
  },

  fetchUser: async () => {
    const token = get().token;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const user = (await res.json()) as { userId: string };
        set({
          userId: user.userId,
          loggedIn: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  logout: () => {
    localStorage.removeItem("refresh");
    set({
      token: undefined,
      userId: undefined,
      loggedIn: false,
    });
    window.location.replace("/");
  },
}));

export const initializeAuth = useAuthStore.getState().initialize;
export const getIsLoggedIn = () => useAuthStore.getState().loggedIn;
export const getToken = () => useAuthStore.getState().token;
export const login = useAuthStore.getState().login;
export const logout = useAuthStore.getState().logout;
