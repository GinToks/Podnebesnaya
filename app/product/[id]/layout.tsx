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

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let jsonLd: any = null;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (product) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "RUB",
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      };
    }
  } catch {}

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}