import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ScentOfDay {
  date: string;
  productId: string;
}

interface ScentCalendarState {
  entries: ScentOfDay[];
  setScent: (date: string, productId: string) => void;
  removeScent: (date: string) => void;
  getScent: (date: string) => string | undefined;
}

export const useScentCalendarStore = create<ScentCalendarState>()(
  persist(
    (set, get) => ({
      entries: [],
      setScent: (date, productId) =>
        set((state) => ({
          entries: [...state.entries.filter((e) => e.date !== date), { date, productId }],
        })),
      removeScent: (date) =>
        set((state) => ({ entries: state.entries.filter((e) => e.date !== date) })),
      getScent: (date) => get().entries.find((e) => e.date === date)?.productId,
    }),
    { name: "podnebesnaya-scent-calendar" }
  )
);
