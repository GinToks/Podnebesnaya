import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Подписка — Поднебесная",
  description: "Оформите подписку на ароматические свечи. Ежемесячная доставка уникальных ароматов.",
};

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return children;
}