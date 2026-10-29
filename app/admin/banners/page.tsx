"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/store/catalogStore";
import { usePromoBannerStore } from "@/store/promoBannerStore";
import BannersTab from "@/components/admin/BannersTab";

export default function AdminBannersPage() {
  const { products, fetchProducts } = useCatalogStore();
  const { fetchBanners } = usePromoBannerStore();
  useEffect(() => {
    fetchProducts();
    fetchBanners();
  }, [fetchProducts, fetchBanners]);
  return <BannersTab products={products} />;
}
