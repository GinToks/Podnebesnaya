"use client";
import { memo } from "react";
import { useMemo, useState, useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Filter, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import Skeleton from "@/components/Skeleton";
import SearchBar from "@/components/SearchBar";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { useCategoryStore } from "@/store/categoryStore";
import { useCatalogStore } from "@/store/catalogStore";
import type { Product, ScentCategory } from "@/data/products";

function ProductGrid() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const categories = useCategoryStore((state) => state.categories);
  const storeProducts = useCatalogStore((state) => state.products);
  const isLoading = useCatalogStore((state) => state.isLoading);
  const seed = useCatalogStore((state) => state.fetchProducts);
  const products: Product[] = Array.isArray(storeProducts) ? storeProducts : [];
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "name">("name");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let arr = products;
    if (category !== "all") {
      arr = arr.filter((p) => p.category === category);
    }
    if (selectedTag) {
      arr = arr.filter((p) => p.tags?.includes(selectedTag));
    }
    const s = search.toLowerCase();
    if (s) {
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          [...p.notes.top, ...p.notes.middle, ...p.notes.base]
            .map((n) => n.toLowerCase())
            .some((n) => n.includes(s))
      );
    }
    arr = arr.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
    return [...arr].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  }, [products, category, sort, search, priceRange]);

  const minPrice = Math.min(...products.map((p) => p.price), 0);
  const maxPrice = Math.max(...products.map((p) => p.price), 5000);

  const activeFilters = category !== "all" || search || priceRange.min > 0 || priceRange.max < 5000;

  return (
    <section id="catalog" ref={ref} className="py-24 relative overflow-hidden">
      <m.div style={{ y }} className="absolute inset-0 pointer-events-none z-0 opacity-8">
        <svg viewBox="0 0 1440 400" fill="none" className="w-full h-full">
          <path d="M0 200 Q360 100 720 200 Q1080 300 1440 200" stroke="#6B8A5E" strokeWidth="1.5" fill="none" />
          <circle cx="200" cy="180" r="30" fill="#E8B4B8" opacity="0.2" />
          <circle cx="720" cy="200" r="40" fill="#6B8A5E" opacity="0.15" />
          <circle cx="1200" cy="170" r="25" fill="#2E5C8A" opacity="0.15" />
        </svg>
      </m.div>
      {/* Sakura petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-petal-fall"
            style={{
              left: `${(i * 17 + 5) % 95}%`,
              top: `${-8 - (i * 6) % 15}%`,
              animationDelay: `${(i * 1.1) % 8}s`,
              animationDuration: `${8 + (i % 4) * 1.5}s`,
            }}
          >
            <svg width={10 + (i % 3) * 3} height={10 + (i % 3) * 3} viewBox="0 0 14 14" fill="none">
              <path d="M7 0 Q9 3.5 7 7 Q5 3.5 7 0Z" fill="#E8B4B8" opacity="0.6" />
              <path d="M7 7 Q10 9.5 7 14 Q4 9.5 7 7Z" fill="#D4949A" opacity="0.4" />
            </svg>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="serif text-3xl sm:text-4xl font-light tracking-[0.1em] text-ink">
              Каталог ароматов
            </h2>
            <p className="text-ink-muted mt-2">
              Уникальные композиции, созданные в духе Поднебесной.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap items-start sm:items-center">
            <SearchBar value={search} onChange={setSearch} />
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-ink-muted self-center">Цена:</span>
              <button onClick={() => setPriceRange({ min: 0, max: 5000 })} className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (priceRange.min === 0 && priceRange.max === 5000 ? "bg-olive text-bg border-olive" : "bg-bg-elevated text-ink border-mist hover:border-sky")}>Все</button>
              <button onClick={() => setPriceRange({ min: 0, max: 1000 })} className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (priceRange.min === 0 && priceRange.max === 1000 ? "bg-olive text-bg border-olive" : "bg-bg-elevated text-ink border-mist hover:border-sky")}>до 1000₽</button>
              <button onClick={() => setPriceRange({ min: 1000, max: 2000 })} className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (priceRange.min === 1000 && priceRange.max === 2000 ? "bg-olive text-bg border-olive" : "bg-bg-elevated text-ink border-mist hover:border-sky")}>1000-2000₽</button>
              <button onClick={() => setPriceRange({ min: 2000, max: 3000 })} className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (priceRange.min === 2000 && priceRange.max === 3000 ? "bg-olive text-bg border-olive" : "bg-bg-elevated text-ink border-mist hover:border-sky")}>2000-3000₽</button>
              <button onClick={() => setPriceRange({ min: 3000, max: 5000 })} className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (priceRange.min === 3000 && priceRange.max === 5000 ? "bg-olive text-bg border-olive" : "bg-bg-elevated text-ink border-mist hover:border-sky")}>3000+₽</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-ink-muted self-center">Теги:</span>
              {Array.from(new Set(products.flatMap((p) => p.tags || []))).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (selectedTag === tag ? "bg-sakura-dark text-bg border-sakura-dark" : "bg-bg-elevated text-ink border-mist hover:border-sky")}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium tracking-wide text-ink/90">
              <Filter size={16} strokeWidth={1.5} />
              <span className="hidden sm:inline">По нотам:</span>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id === category ? "all" : cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      category === cat.id
                        ? "bg-olive text-bg border-olive"
                        : "bg-bg-elevated text-ink border-mist hover:border-sky"
                    }`}
                  >
                    <span className="morph-icon" aria-hidden="true">
                      <svg className="morph-tree" viewBox="0 0 24 24">
                        <path d="M12 2 L12 22 M12 6 L8 9 M12 6 L16 9 M12 12 L7 16 M12 12 L17 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      </svg>
                      <svg className="morph-leaf" viewBox="0 0 24 24">
                        <path d="M12 20 C12 20 4 14 4 8 C4 4 8 3 12 6 C16 3 20 4 20 8 C20 14 12 20 12 20Z" fill="currentColor" opacity="0.85" />
                      </svg>
                      <svg className="morph-branch" viewBox="0 0 24 24">
                        <path d="M4 20 Q12 18 20 20 M6 20 Q8 12 12 8 M12 8 Q16 12 18 20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    </span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <PriceRangeFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onChange={setPriceRange}
            />
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as "price-asc" | "price-desc" | "name")
              }
              className="px-4 py-2 rounded-full bg-bg-elevated border border-mist text-sm text-ink outline-none focus:border-sky focus:ring-1 focus:ring-sky transition-colors"
            >
              <option value="name">По названию</option>
              <option value="price-asc">По цене: дешёвые</option>
              <option value="price-desc">По цене: дорогие</option>
            </select>
            {activeFilters && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setPriceRange({ min: 0, max: 5000 });
                  setSort("name");
                }}
                className="flex items-center gap-1.5 text-xs text-accent hover:underline"
              >
                <X size={14} strokeWidth={2} /> Сбросить фильтры
              </button>
            )}
          </div>
        </div>

        {products.length === 0 && (
          <button
            onClick={seed}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-bg text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Заполнить каталог образцами
          </button>
        )}

        {isLoading && products.length === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-mist p-3">
                <Skeleton className="aspect-square mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
          {filtered.length === 0 && products.length > 0 && (
            <div className="lg:col-span-4 py-20 text-center">
              <p className="text-ink-muted text-sm">Товары не найдены по выбранным фильтрам</p>
            </div>
          )}
        </div>
        )}

        <QuickViewModal
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct!}
        />
      </div>
    </section>
  );
}

export default memo(ProductGrid);
