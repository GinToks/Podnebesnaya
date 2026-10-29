import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://podnebesnaya.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/catalog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/track`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/wishlist`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];
}
