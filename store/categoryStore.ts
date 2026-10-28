import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Category {
  id: string;
  label: string;
  color: string;
}

interface CategoryState {
  categories: Category[];
  addCategory: (cat: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategory: (id: string) => Category | undefined;
}

const defaultCategories: Category[] = [
  { id: "woody", label: "Древесные", color: "#6B8A5E" },
  { id: "floral", label: "Цветочные", color: "#E8B4B8" },
  { id: "spicy", label: "Пряные", color: "#C41E3A" },
  { id: "fresh", label: "Свежие", color: "#2E5C8A" },
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,
      addCategory: (cat) => {
        const id = cat.label.toLowerCase().replace(/\s+/g, "-");
        set((state) => ({ categories: [...state.categories, { ...cat, id }] }));
      },
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCategory: (id) =>
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),
      getCategory: (id) => get().categories.find((c) => c.id === id),
    }),
    { name: "podnebesnaya-categories" }
  )
);