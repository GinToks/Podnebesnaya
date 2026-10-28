import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface ThemeColors {
  bg: string;
  bgElevated: string;
  ink: string;
  inkMuted: string;
  accent: string;
  accentHover: string;
  olive: string;
  oliveHover: string;
  sky: string;
  skyHover: string;
  gold: string;
  goldHover: string;
  mist: string;
  mistStrong: string;
  sakura: string;
  sakuraDark: string;
  bamboo: string;
  bambooDark: string;
}

export const seasonThemes: Record<Season, { name: string; emoji: string; colors: ThemeColors }> = {
  spring: {
    name: "Весна",
    emoji: "🌸",
    colors: {
      bg: "#FFF0F5",
      bgElevated: "#FFF5F8",
      ink: "#2D1B2F",
      inkMuted: "#5B4B5F",
      accent: "#E87898",
      accentHover: "#D46888",
      olive: "#7BB88A",
      oliveHover: "#6BA87A",
      sky: "#88B8E8",
      skyHover: "#78A8D8",
      gold: "#E8C878",
      goldHover: "#D8B868",
      mist: "#F0E0E8",
      mistStrong: "#E8D8E0",
      sakura: "#F8A8C0",
      sakuraDark: "#E888A0",
      bamboo: "#7BB88A",
      bambooDark: "#6BA87A",
    },
  },
  summer: {
    name: "Лето",
    emoji: "☀️",
    colors: {
      bg: "#F0F8FF",
      bgElevated: "#F5FBFF",
      ink: "#1A3040",
      inkMuted: "#4A6878",
      accent: "#1E88D4",
      accentHover: "#0E78C4",
      olive: "#4AA86E",
      oliveHover: "#3A985E",
      sky: "#3A90E0",
      skyHover: "#2A80D0",
      gold: "#E8B84A",
      goldHover: "#D8A83A",
      mist: "#D8E8F8",
      mistStrong: "#C8D8F0",
      sakura: "#88C8F0",
      sakuraDark: "#68A8D0",
      bamboo: "#4AA86E",
      bambooDark: "#3A985E",
    },
  },
  autumn: {
    name: "Осень",
    emoji: "🍂",
    colors: {
      bg: "#FFF5E8",
      bgElevated: "#FFF8F0",
      ink: "#3D2B1F",
      inkMuted: "#6B5B4F",
      accent: "#D46A28",
      accentHover: "#C45A18",
      olive: "#6B8A4E",
      oliveHover: "#5A7A3E",
      sky: "#E8A585",
      skyHover: "#D89575",
      gold: "#D8A040",
      goldHover: "#C89030",
      mist: "#F0E0D0",
      mistStrong: "#E8D8C8",
      sakura: "#F0A888",
      sakuraDark: "#E09878",
      bamboo: "#7A9A5E",
      bambooDark: "#6A8A4E",
    },
  },
  winter: {
    name: "Зима",
    emoji: "❄️",
    colors: {
      bg: "#F0F5FA",
      bgElevated: "#F5F8FD",
      ink: "#1A2E40",
      inkMuted: "#4A5A6A",
      accent: "#2A80E0",
      accentHover: "#1A70D0",
      olive: "#6A9AC0",
      oliveHover: "#5A8AB0",
      sky: "#4A90E8",
      skyHover: "#3A80D8",
      gold: "#8AA8C8",
      goldHover: "#7A98B8",
      mist: "#D8E4F0",
      mistStrong: "#C8D4E8",
      sakura: "#88B8F0",
      sakuraDark: "#6898D0",
      bamboo: "#6A9AC0",
      bambooDark: "#5A8AB0",
    },
  },
};

interface ThemeState {
  season: Season;
  setSeason: (season: Season) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      season: "autumn",
      setSeason: (season) => set({ season }),
    }),
    { name: "podnebesnaya-theme" }
  )
);