import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://podnebesnaya.vercel.app";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/catalog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/track`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/wishlist`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/gift-cards`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/loyalty`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/subscription`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/surprise-box`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/build-box`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({ select: { id: true, updatedAt: true } });
    productRoutes = products.map((p) => ({
      url: `${base}/product/${p.id}`,
      lastModified: p.updatedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // DB unavailable at build time — skip product routes
  }

  return [...staticRoutes, ...productRoutes];
}
