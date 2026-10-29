"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import Hero from "@/components/Hero";
const Philosophy = dynamic(() => import("@/components/Philosophy"), { loading: () => null });
const SeasonalCollections = dynamic(() => import("@/components/SeasonalCollections"), { loading: () => null });
const ScentMap = dynamic(() => import("@/components/ScentMap"), { loading: () => null });
const ScentCalendar = dynamic(() => import("@/components/ScentCalendar"), { loading: () => null });
const GiftSets = dynamic(() => import("@/components/GiftSets"), { loading: () => null });
const ProductGrid = dynamic(() => import("@/components/ProductGrid"), { loading: () => null });
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
