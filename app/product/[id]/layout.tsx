import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (product) {
      return {
        title: `${product.name} — Поднебесная`,
        description: product.description,
        openGraph: {
          title: `${product.name} — Поднебесная`,
          description: product.description,
          type: "website",
        },
      };
    }
  } catch {}
  return {
    title: "Товар — Поднебесная",
    description: "Ароматические свечи ручной работы",
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}