import { create } from "zustand";

export interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>()((set) => ({
  isAuthenticated: false,
  isLoading: true,
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
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    set({ isAuthenticated: false });
  },
  checkAuth: async () => {
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json();
      set({ isAuthenticated: data.authenticated === true, isLoading: false });
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));