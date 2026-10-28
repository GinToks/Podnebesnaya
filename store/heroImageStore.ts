import { create } from "zustand";

interface HeroImageState {
  imageUrl: string;
  setImage: (url: string) => void;
  clearImage: () => void;
}

const STORAGE_KEY = "podnebesnaya-hero-image-url";

function getInitialImage(): string {
  if (typeof window === "undefined") return "/IMG_7265.PNG";
  try {
    return localStorage.getItem(STORAGE_KEY) || "/IMG_7265.PNG";
  } catch (e) {
    return "/IMG_7265.PNG";
  }
}

export const useHeroImageStore = create<HeroImageState>()((set) => ({
  imageUrl: getInitialImage(),
  setImage: (url) => {
    try {
      localStorage.setItem(STORAGE_KEY, url);
    } catch (e) {
      console.error("Failed to save image to localStorage:", e);
      // Try clearing other data to free space
      try {
        localStorage.removeItem("podnebesnaya-hero-image");
        localStorage.setItem(STORAGE_KEY, url);
      } catch (e2) {
        console.error("Failed to save image after clearing:", e2);
      }
    }
    set({ imageUrl: url });
  },
  clearImage: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    set({ imageUrl: "/IMG_7265.PNG" });
  },
}));