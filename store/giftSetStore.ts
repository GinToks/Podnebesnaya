import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GiftSet {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  price: number;
  image: string;
  active: boolean;
}

interface GiftSetState {
  sets: GiftSet[];
  addSet: (set: Omit<GiftSet, "id">) => void;
  updateSet: (id: string, updates: Partial<GiftSet>) => void;
  deleteSet: (id: string) => void;
  getActiveSets: () => GiftSet[];
}

export const useGiftSetStore = create<GiftSetState>()(
  persist(
    (set, get) => ({
      sets: [],
      addSet: (gs) => {
        const id = `gs-${Date.now()}`;
        set((state) => ({ sets: [...state.sets, { ...gs, id }] }));
      },
      updateSet: (id, updates) =>
        set((state) => ({
          sets: state.sets.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      deleteSet: (id) =>
        set((state) => ({ sets: state.sets.filter((s) => s.id !== id) })),
      getActiveSets: () => get().sets.filter((s) => s.active),
    }),
    { name: "podnebesnaya-gift-sets" }
  )
);
