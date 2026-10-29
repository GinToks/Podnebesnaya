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
import Reveal from "@/components/Reveal";
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
        <Reveal delay={0.05}><Philosophy /></Reveal>
        <Reveal delay={0.1}><SeasonalCollections /></Reveal>
        <Reveal delay={0.15}><ScentMap /></Reveal>
        <Reveal delay={0.2}><ScentCalendar /></Reveal>
        <Reveal delay={0.25}><GiftSets /></Reveal>
        <Reveal delay={0.3}><ProductGrid /></Reveal>
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
}
