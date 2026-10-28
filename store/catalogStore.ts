import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Product, ScentCategory } from "@/data/products";

export interface CatalogState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
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
  devtools((set, get) => ({
    products: [],
    isLoading: false,
    error: null,
    setProducts: (products) => set({ products }),
    fetchProducts: async () => {
      set({ isLoading: true, error: null });
      let lastErr: any;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch("/api/catalog");
          if (!res.ok) throw new Error("Failed to fetch catalog");
          const products = await res.json();
          set({ products, isLoading: false });
          get().applyLowStockPromo();
          return;
        } catch (e) {
          lastErr = e;
          await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        }
      }
      set({ error: (lastErr as Error)?.message || "Failed", isLoading: false });
    },
    addProduct: async (product) => {
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to add product");
      const newProduct = await res.json();
      set((state) => ({ products: [...state.products, newProduct] }));
    },
    updateProduct: async (id, patch) => {
      const prev = get().products;
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }));
      try {
        const res = await fetch("/api/catalog", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...patch }),
        });
        if (!res.ok) throw new Error("Failed to update product");
        const updated = await res.json();
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? updated : p)),
        }));
      } catch (e) {
        set({ products: prev });
        throw e;
      }
    },
    deleteProduct: async (id) => {
      const res = await fetch("/api/catalog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete product");
      set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
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
      // Fetch from API instead of seeding locally
      get().fetchProducts();
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
  }))
);

export type { ScentCategory };
