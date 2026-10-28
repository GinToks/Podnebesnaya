import { create } from "zustand";

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  endDate: string;
  bgColor: string;
  textColor: string;
  active: boolean;
  link?: string;
  linkText?: string;
  discount?: number;
  selectedProductIds?: string[];
}

interface PromoBannerState {
  banners: PromoBanner[];
  isLoading: boolean;
  fetchBanners: () => Promise<void>;
  addBanner: (banner: Omit<PromoBanner, "id">) => Promise<void>;
  updateBanner: (id: string, updates: Partial<PromoBanner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  getActiveBanners: () => PromoBanner[];
}

export const usePromoBannerStore = create<PromoBannerState>()((set, get) => ({
  banners: [],
  isLoading: false,
  fetchBanners: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/banners");
      if (!res.ok) throw new Error("Failed to fetch banners");
      const data = await res.json();
      set({ banners: Array.isArray(data) ? data : [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  addBanner: async (banner) => {
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banner),
      });
      if (!res.ok) throw new Error("Failed to create banner");
      const created = await res.json();
      set((state) => ({ banners: [...state.banners, created] }));
    } catch (e) {
      console.error(e);
    }
  },
  updateBanner: async (id, updates) => {
    try {
      const res = await fetch("/api/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update banner");
      const updated = await res.json();
      set((state) => ({
        banners: state.banners.map((b) => (b.id === id ? updated : b)),
      }));
    } catch (e) {
      console.error(e);
    }
  },
  deleteBanner: async (id) => {
    try {
      const res = await fetch("/api/banners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete banner");
      set((state) => ({ banners: state.banners.filter((b) => b.id !== id) }));
    } catch (e) {
      console.error(e);
    }
  },
  getActiveBanners: () =>
    get().banners.filter((b) => b.active && new Date(b.endDate) > new Date()),
}));
