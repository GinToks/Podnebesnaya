import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://podnebesnaya.ru";
  const now = new Date();

  const staticPages = [
    { url: base, changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/gift-cards`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/loyalty`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/subscription`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/surprise-box`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/wishlist`, changeFrequency: "weekly" as const, priority: 0.5 },
  ];

  // Admin is excluded from sitemap (Disallow in robots.txt)

  return staticPages.map((page) => ({
    ...page,
    lastModified: now,
  }));
}
