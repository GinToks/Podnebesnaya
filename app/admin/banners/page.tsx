"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/store/catalogStore";
import BannersTab from "@/components/admin/BannersTab";

export default function AdminBannersPage() {
  const { products, fetchProducts } = useCatalogStore();
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  return <BannersTab products={products} />;
}