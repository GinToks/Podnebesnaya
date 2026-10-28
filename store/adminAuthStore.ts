import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminAuthState {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isBlocked: () => boolean;
  getRemainingBlockTime: () => number;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: async (password) => {
        try {
          const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          });
          const data = await res.json();
          if (data.success) {
            set({ isAuthenticated: true });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      logout: () => set({ isAuthenticated: false }),
      isBlocked: () => false,
      getRemainingBlockTime: () => 0,
    }),
    { name: "podnebesnaya-admin" }
  )
);
