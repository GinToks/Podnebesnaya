import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://podnebesnaya.ru";
  const now = new Date();

  const staticPages = [
    { url: base, changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/gift-cards`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/loyalty`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/subscription`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/surprise-box`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/build-box`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/wishlist`, changeFrequency: "weekly" as const, priority: 0.5 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({ select: { id: true, updatedAt: true } });
    productPages = products.map((p) => ({
      url: `${base}/product/${p.id}`,
      lastModified: p.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {}

  return [...staticPages.map((p) => ({ ...p, lastModified: now })), ...productPages];
}
