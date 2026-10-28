"use client";
import { useEffect } from "react";
import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import SeasonalCollections from "@/components/SeasonalCollections";
import ScentMap from "@/components/ScentMap";
import ScentCalendar from "@/components/ScentCalendar";
import GiftSets from "@/components/GiftSets";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { useCatalogStore } from "@/store/catalogStore";

export default function HomePage() {
  const { fetchProducts, applyLowStockPromo } = useCatalogStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="relative z-10">
      <PromoBanner />
      <Header />
      <main>
        <Hero />
        <Philosophy />
        <SeasonalCollections />
        <ScentMap />
        <ScentCalendar />
        <GiftSets />
        <ProductGrid />
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
}
