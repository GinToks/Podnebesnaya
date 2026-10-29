"use client";
import { useEffect } from "react";
import { useCatalogStore } from "@/store/catalogStore";
import { usePromoStore } from "@/store/promoStore";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const { fetchProducts: seed } = useCatalogStore();
  const { fetchCodes } = usePromoStore();

  useEffect(() => {
    seed();
    fetchCodes();
  }, [seed, fetchCodes]);

  return <>{children}</>;
}
