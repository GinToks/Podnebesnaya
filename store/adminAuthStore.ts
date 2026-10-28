import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminAuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isBlocked: () => boolean;
  getRemainingBlockTime: () => number;
}

const ADMIN_PASSWORD = "admin123";
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  blockedUntil: number;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      login: (password) => {
        const now = Date.now();
        const rl = JSON.parse(localStorage.getItem("podnebesnaya-ratelimit") || '{"attempts":0,"lastAttempt":0,"blockedUntil":0}');
        if (rl.blockedUntil > now) {
          return false;
        }
        if (password === ADMIN_PASSWORD) {
          localStorage.setItem("podnebesnaya-ratelimit", JSON.stringify({ attempts: 0, lastAttempt: now, blockedUntil: 0 }));
          set({ isAuthenticated: true });
          return true;
        }
        rl.attempts = (rl.attempts || 0) + 1;
        rl.lastAttempt = now;
        if (rl.attempts >= MAX_ATTEMPTS) {
          rl.blockedUntil = now + BLOCK_DURATION;
        }
        localStorage.setItem("podnebesnaya-ratelimit", JSON.stringify(rl));
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      isBlocked: () => {
        const rl = JSON.parse(localStorage.getItem("podnebesnaya-ratelimit") || '{"attempts":0,"lastAttempt":0,"blockedUntil":0}');
        return rl.blockedUntil > Date.now();
      },
      getRemainingBlockTime: () => {
        const rl = JSON.parse(localStorage.getItem("podnebesnaya-ratelimit") || '{"attempts":0,"lastAttempt":0,"blockedUntil":0}');
        return Math.max(0, rl.blockedUntil - Date.now());
      },
    }),
    { name: "podnebesnaya-admin" }
  )
);
