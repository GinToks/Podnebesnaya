import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SeasonalCollection {
  id: string;
  name: string;
  description: string;
  season: "spring" | "summer" | "autumn" | "winter";
  productIds: string[];
  bannerImage?: string;
  active: boolean;
  startDate: string;
  endDate: string;
}

interface CollectionState {
  collections: SeasonalCollection[];
  addCollection: (collection: Omit<SeasonalCollection, "id">) => void;
  updateCollection: (id: string, updates: Partial<SeasonalCollection>) => void;
  deleteCollection: (id: string) => void;
  getActiveCollections: () => SeasonalCollection[];
  seed: () => void;
}

const defaultCollections: SeasonalCollection[] = [
  {
    id: "spring-sakura",
    name: "Весна: Цветение сакуры",
    description: "Нежные цветочные ароматы для весеннего настроения",
    season: "spring",
    productIds: [],
    active: true,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      collections: defaultCollections,
      addCollection: (collection) => {
        const id = `col-${Date.now()}`;
        set((state) => ({ collections: [...state.collections, { ...collection, id }] }));
      },
      updateCollection: (id, updates) =>
        set((state) => ({
          collections: state.collections.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCollection: (id) =>
        set((state) => ({ collections: state.collections.filter((c) => c.id !== id) })),
      getActiveCollections: () =>
        get().collections.filter((c) => c.active && new Date(c.endDate) > new Date() && new Date(c.startDate) <= new Date()),
      seed: () => {
        if (get().collections.length === 0) {
          set({ collections: defaultCollections });
        }
      },
    }),
    { name: "podnebesnaya-collections" }
  )
);