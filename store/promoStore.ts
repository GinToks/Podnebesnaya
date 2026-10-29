import { create } from "zustand";
import type { PromoCode } from "@/data/products";

export interface PromoState {
  codes: PromoCode[];
  isLoading: boolean;
  fetchCodes: () => Promise<void>;
  addCode: (code: Omit<PromoCode, "usedCount">) => Promise<void>;
  updateCode: (code: string, patch: Partial<PromoCode>) => Promise<void>;
  deleteCode: (code: string) => Promise<void>;
  applyCode: (code: string) => PromoCode | null;
  incrementUses: (code: string) => void;
  getCode: (code: string) => PromoCode | undefined;
}

export const usePromoStore = create<PromoState>()((set, get) => ({
  codes: [],
  isLoading: false,
  fetchCodes: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/promos");
      if (res.ok) {
        const data = await res.json();
        set({ codes: Array.isArray(data) ? data : [], isLoading: false });
        return;
      }
    } catch {}
    set({ isLoading: false });
  },
  addCode: async (code) => {
    try {
      const res = await fetch("/api/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...code, usedCount: 0 }),
      });
      if (res.ok) {
        const created = await res.json();
        set((state) => ({ codes: [...state.codes.filter((c) => c.code !== created.code), created] }));
        return;
      }
    } catch {}
    set((state) => ({ codes: [...state.codes, { ...code, usedCount: 0 }] }));
  },
  updateCode: async (code, patch) => {
    set((state) => ({ codes: state.codes.map((c) => (c.code === code ? { ...c, ...patch } : c)) }));
    try {
      await fetch("/api/promos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, ...patch }),
      });
    } catch {}
  },
  deleteCode: async (code) => {
    set((state) => ({ codes: state.codes.filter((c) => c.code !== code) }));
    try {
      await fetch("/api/promos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
    } catch {}
  },
  applyCode: (code) => {
    const c = get().codes.find((c) => c.code === code);
    if (!c || !c.active) return null;
    if (c.expiresAt && new Date(c.expiresAt) < new Date()) return null;
    if (c.usedCount >= c.maxUses) return null;
    return c;
  },
  incrementUses: (code) => {
    set((state) => ({
      codes: state.codes.map((c) =>
        c.code === code ? { ...c, usedCount: c.usedCount + 1 } : c
      ),
    }));
    try {
      fetch("/api/promos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, usedCount: (get().codes.find((c) => c.code === code)?.usedCount ?? 0) }),
      }).catch(() => {});
    } catch {}
  },
  getCode: (code) => get().codes.find((c) => c.code === code),
}));