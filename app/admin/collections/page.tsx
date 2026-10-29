"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/store/catalogStore";
import CollectionsTab from "@/components/admin/CollectionsTab";

export default function AdminCollectionsPage() {
  const { products, fetchProducts } = useCatalogStore();
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  return <CollectionsTab products={products} />;
}