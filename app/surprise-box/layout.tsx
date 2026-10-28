import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сюрприз-бокс — Поднебесная",
  description: "Закажите сюрприз-бокс с ароматическими свечами. Каждая коробка — уникальная история ароматов.",
};

export default function SurpriseBoxLayout({ children }: { children: React.ReactNode }) {
  return children;
}