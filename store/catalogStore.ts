import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import type { Product, ScentCategory } from "@/data/products";
import { products as seedProducts } from "@/data/products";

export interface CatalogState {
  products: Product[];
  isLoading: boolean;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (fromId: string, toId: string) => void;
  getProduct: (id: string) => Product | undefined;
  seed: () => void;
  applyLowStockPromo: () => void;
}

const generateId = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-");

export const useCatalogStore = create<CatalogState>()(
  devtools(
    persist(
      (set, get) => ({
        products: [],
        isLoading: false,
        setProducts: (products) => set({ products }),
        addProduct: (product) => {
          const id = generateId(product.name);
          const exists = get().products.some((p) => p.id === id);
          const finalId = exists ? `${id}-${Date.now()}` : id;
          set((state) => ({
            products: [...state.products, { ...product, id: finalId }],
          }));
        },
        updateProduct: (id, patch) => {
          set((state) => ({
            products: state.products.map((p) =>
              p.id === id ? { ...p, ...patch } : p
            ),
          }));
        },
        deleteProduct: (id) => {
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
          }));
        },
        reorderProducts: (fromId, toId) => {
          set((state) => {
            const products = [...state.products];
            const fromIdx = products.findIndex((p) => p.id === fromId);
            const toIdx = products.findIndex((p) => p.id === toId);
            if (fromIdx < 0 || toIdx < 0) return state;
            const [moved] = products.splice(fromIdx, 1);
            products.splice(toIdx, 0, moved);
            return { products };
          });
        },
        getProduct: (id) => get().products.find((p) => p.id === id),
        seed: () => {
          if (get().products.length === 0) {
            set({ products: seedProducts });
          }
          get().applyLowStockPromo();
        },
        applyLowStockPromo: () => {
          set((state) => ({
            products: state.products.map((p) => {
              if (p.stock <= 3 && p.stock > 0) {
                const origPrice = p.originalPrice || p.price;
                const newPrice = Math.round(origPrice * 0.95);
                return { ...p, offer: { label: "Почти закончились -5%", active: true }, originalPrice: origPrice, price: newPrice };
              }
              return p;
            }),
          }));
        },
      }),
      {
        name: "podnebesnaya-catalog",
        partialize: (state) => ({ products: state.products }) as any,
        storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined,
      }
    )
  )
);

export type { ScentCategory };
