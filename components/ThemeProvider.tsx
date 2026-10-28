"use client";
import { useEffect } from "react";
import { useThemeStore, seasonThemes } from "@/store/themeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const season = useThemeStore((state) => state.season);
  const theme = seasonThemes[season];

  useEffect(() => {
    const root = document.documentElement;
    const colors = theme.colors;
    root.style.setProperty("--color-bg", colors.bg);
    root.style.setProperty("--color-bg-elevated", colors.bgElevated);
    root.style.setProperty("--color-ink", colors.ink);
    root.style.setProperty("--color-ink-muted", colors.inkMuted);
    root.style.setProperty("--color-accent", colors.accent);
    root.style.setProperty("--color-accent-hover", colors.accentHover);
    root.style.setProperty("--color-olive", colors.olive);
    root.style.setProperty("--color-olive-hover", colors.oliveHover);
    root.style.setProperty("--color-sky", colors.sky);
    root.style.setProperty("--color-sky-hover", colors.skyHover);
    root.style.setProperty("--color-gold", colors.gold);
    root.style.setProperty("--color-gold-hover", colors.goldHover);
    root.style.setProperty("--color-mist", colors.mist);
    root.style.setProperty("--color-mist-strong", colors.mistStrong);
    root.style.setProperty("--color-sakura", colors.sakura);
    root.style.setProperty("--color-sakura-dark", colors.sakuraDark);
    root.style.setProperty("--color-bamboo", colors.bamboo);
    root.style.setProperty("--color-bamboo-dark", colors.bambooDark);
    root.style.backgroundColor = colors.bg;
  }, [season, theme]);

  return <>{children}</>;
}