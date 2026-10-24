import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/models";
import { clearSessionFlagCookie, setSessionFlagCookie } from "@/lib/auth/cookies";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  setSession: (session: { accessToken: string; refreshToken: string; user: AuthUser }) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  clear: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,
      setSession: ({ accessToken, refreshToken, user }) => {
        setSessionFlagCookie();
        set({ accessToken, refreshToken, user });
      },
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      clear: () => {
        clearSessionFlagCookie();
        set({ accessToken: null, refreshToken: null, user: null });
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "Accewa-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/** Read tokens outside React (e.g. from the Axios interceptor). */
export function getAuthSnapshot() {
  return useAuthStore.getState();
}

