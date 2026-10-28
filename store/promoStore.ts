import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PromoCode } from "@/data/products";

export interface PromoState {
  codes: PromoCode[];
  addCode: (code: Omit<PromoCode, "usedCount">) => void;
  updateCode: (code: string, patch: Partial<PromoCode>) => void;
  deleteCode: (code: string) => void;
  applyCode: (code: string) => PromoCode | null;
  incrementUses: (code: string) => void;
  getCode: (code: string) => PromoCode | undefined;
}

export const usePromoStore = create<PromoState>()(
  persist(
    (set, get) => ({
      codes: [],
      addCode: (code) =>
        set((state) => ({
          codes: [...state.codes, { ...code, usedCount: 0 }],
        })),
      updateCode: (code, patch) =>
        set((state) => ({
          codes: state.codes.map((c) =>
            c.code === code ? { ...c, ...patch } : c
          ),
        })),
      deleteCode: (code) =>
        set((state) => ({
          codes: state.codes.filter((c) => c.code !== code),
        })),
      applyCode: (code) => {
        const c = get().codes.find((c) => c.code === code);
        if (!c || !c.active) return null;
        if (c.expiresAt && new Date(c.expiresAt) < new Date()) return null;
        if (c.usedCount >= c.maxUses) return null;
        return c;
      },
      incrementUses: (code) =>
        set((state) => ({
          codes: state.codes.map((c) =>
            c.code === code ? { ...c, usedCount: c.usedCount + 1 } : c
          ),
        })),
      getCode: (code) => get().codes.find((c) => c.code === code),
    }),
    { name: "podnebesnaya-promos" }
  )
);
