"use client";
import { useEffect } from "react";
import { useCatalogStore } from "@/store/catalogStore";
import { usePromoStore } from "@/store/promoStore";
import { promoCodes } from "@/data/products";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const { fetchProducts: seed } = useCatalogStore();
  const { codes, addCode } = usePromoStore();

  useEffect(() => {
    seed();
    if (codes.length === 0) {
      promoCodes.forEach((code) => addCode(code));
    }
  }, [seed, codes.length, addCode]);

  return <>{children}</>;
}
