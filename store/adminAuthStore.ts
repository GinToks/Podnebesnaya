import { create } from "zustand";

export interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string, code?: string) => Promise<"ok" | "2fa" | "fail">;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>()((set) => ({
  isAuthenticated: false,
  isLoading: true,
  login: async (password, code) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code }),
      });
      const data = await res.json();
      if (data.success) {
        set({ isAuthenticated: true });
        return "ok";
      }
      if (data.requires2fa) return "2fa";
      return "fail";
    } catch {
      return "fail";
    }
  },
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    set({ isAuthenticated: false });
    window.location.href = "/admin/login";
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