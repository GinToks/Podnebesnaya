import { create } from "zustand";

interface CustomerAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { email: string; name: string | null; emailVerified?: boolean } | null;
  isAdmin: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useCustomerAuthStore = create<CustomerAuthState>()((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  isAdmin: false,
  checkAuth: async () => {
    try {
      const res = await fetch("/api/customer/me");
      if (res.ok) {
        const data = await res.json();
        set({ isAuthenticated: true, user: { email: data.email, name: data.name, emailVerified: data.emailVerified }, isAdmin: data.email === "admin@admin.ru", isLoading: false });
      } else {
        set({ isAuthenticated: false, user: null, isAdmin: false, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, user: null, isAdmin: false, isLoading: false });
    }
  },
  login: async (email, password) => {
    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        set({ isAuthenticated: true, user: { email: data.email, name: data.name, emailVerified: data.emailVerified }, isAdmin: data.isAdmin === true || data.email === "admin@admin.ru", isLoading: false });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  logout: async () => {
    try { await fetch("/api/customer/me", { method: "DELETE" }); } catch {}
    set({ isAuthenticated: false, user: null, isAdmin: false });
  },
}));