"use client";
import { useState, useEffect } from "react";
import { usePromoBannerStore } from "@/store/promoBannerStore";
import PromoTimer from "@/components/PromoTimer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PromoBanner() {
  const [mounted, setMounted] = useState(false);
  const { getActiveBanners, fetchBanners } = usePromoBannerStore();
  useEffect(() => {
    setMounted(true);
    fetchBanners();
  }, [fetchBanners]);
  const banners = mounted ? getActiveBanners() : [];

  if (banners.length === 0) return null;

  return (
    <div className="space-y-0">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="py-3 px-4 text-center"
          style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
        >
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="text-sm font-medium">{banner.title}</span>
            <span className="text-xs opacity-80">{banner.subtitle}</span>
            <PromoTimer endDate={banner.endDate} className="ml-2" />
            {banner.link && (
              <Link
                href={banner.link}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide hover:underline"
              >
                {banner.linkText || "Подробнее"} <ChevronRight size={12} />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}