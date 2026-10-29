"use client";

import { useEffect } from "react";
import { useOrderStore } from "@/store/orderStore";
import { useCatalogStore } from "@/store/catalogStore";
import { usePromoStore } from "@/store/promoStore";
import AnalyticsTab from "@/components/admin/AnalyticsTab";

export default function AdminAnalyticsPage() {
  const { fetchOrders } = useOrderStore();
  const { fetchProducts } = useCatalogStore();
  const { fetchCodes } = usePromoStore();
  useEffect(() => {
    fetchOrders();
    fetchProducts();
    if (fetchCodes) fetchCodes();
  }, [fetchOrders, fetchProducts, fetchCodes]);
  return <AnalyticsTab />;
}
