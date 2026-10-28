import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  addBanner: (banner: Omit<PromoBanner, "id">) => void;
  updateBanner: (id: string, updates: Partial<PromoBanner>) => void;
  deleteBanner: (id: string) => void;
  getActiveBanners: () => PromoBanner[];
}

export const usePromoBannerStore = create<PromoBannerState>()(
  persist(
    (set, get) => ({
      banners: [
        {
          id: "pb-1",
          title: "Весенняя коллекция",
          subtitle: "Скидка 20% на все свечи с ароматом сакуры",
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          bgColor: "#E8B4B8",
          textColor: "#3D2B1F",
          active: true,
          link: "#catalog",
          linkText: "Смотреть",
        },
      ],
      addBanner: (banner) => {
        const id = `pb-${Date.now()}`;
        set((state) => ({ banners: [...state.banners, { ...banner, id }] }));
      },
      updateBanner: (id, updates) =>
        set((state) => ({
          banners: state.banners.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      deleteBanner: (id) =>
        set((state) => ({ banners: state.banners.filter((b) => b.id !== id) })),
      getActiveBanners: () =>
        get().banners.filter((b) => b.active && new Date(b.endDate) > new Date()),
    }),
    { name: "podnebesnaya-promo-banners" }
  )
);