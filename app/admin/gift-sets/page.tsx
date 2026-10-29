"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/store/catalogStore";
import GiftSetsTab from "@/components/admin/GiftSetsTab";

export default function AdminGiftSetsPage() {
  const { products, fetchProducts } = useCatalogStore();
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  return <GiftSetsTab products={products} />;
}