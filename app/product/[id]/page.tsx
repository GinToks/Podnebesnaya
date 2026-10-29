"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCatalogStore } from "@/store/catalogStore";
import { useCartStore } from "@/store/cartStore";
import { m } from "framer-motion";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import BreathingCandle from "@/components/BreathingCandle";
import RelatedProducts from "@/components/RelatedProducts";
import ReviewsBlock from "@/components/ReviewsBlock";
import type { Product } from "@/data/products";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, getProduct, fetchProducts } = useCatalogStore();
  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [mainImage, setMainImage] = useState<any>(null);

  const product: Product | undefined = id && products.length ? getProduct(String(id)) : undefined;

  useEffect(() => {
    if (product?.images?.[0]) {
      setMainImage(product.images[0]);
    } else if (product) {
      setMainImage({ id: "default", url: "", alt: product.name });
    }
  }, [product?.id, product]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!products.length) {
    return null;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-ink-muted">Товар не найден</p>
        <Link
          href="/#catalog"
          className="mt-4 inline-flex items-center gap-2 text-accent font-medium hover:underline transition-colors"
        >
          <ArrowLeft size={16} /> Вернуться в каталог
        </Link>
      </div>
    );
  }

  const notes = product.notes
    ? [...(product.notes.top || []), ...(product.notes.middle || []), ...(product.notes.base || [])]
    : [];
  const inStock = typeof product.stock === "number" ? product.stock > 0 : true;

  const handleAdd = () => {
    if (!inStock) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: (product.images || []).map((i: any) => i.url).filter(Boolean),
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "RUB",
              availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url: `https://podnebesnaya.vercel.app/product/${product.id}`,
            },
          }).replace(/</g, "\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "https://podnebesnaya.ru/" },
              { "@type": "ListItem", position: 2, name: "Каталог", item: "https://podnebesnaya.ru/#catalog" },
              { "@type": "ListItem", position: 3, name: product.name, item: `https://podnebesnaya.ru/product/${product.id}` },
            ],
          }).replace(/</g, "\u003c"),
        }}
      />
      <section className="py-20 sm:py-28 lg:py-36 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent mb-8 hover:underline transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={2} /> Вернуться в каталог
        </Link>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="relative h-[420px] rounded-xl overflow-hidden bg-mist border border-mist">
            <div className="absolute bottom-4 right-4 w-16 h-24 z-10">
              <BreathingCandle />
            </div>
            <ProductGallery
              images={product.images || (mainImage ? [mainImage] : [])}
              mainImage={mainImage}
              onSelect={(img) => setMainImage(img)}
            />
            {product.offer?.active && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-bg text-xs font-bold tracking-wide uppercase shadow-sm">
                {product.offer.label}
              </span>
            )}
            {!inStock && (
              <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-accent text-bg text-xs font-bold tracking-wide uppercase shadow-sm">
                Нет в наличии
              </span>
            )}
          </div>
          <div>
            <m.h1
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 14 }}
              viewport={{ once: true }}
              className="serif text-4xl sm:text-5xl font-light tracking-[0.1em] leading-tight text-ink mb-4"
            >
              {product.name}
            </m.h1>
            {product.offer?.active && (
              <span className="inline-block py-1 px-3 rounded-full border border-sky/50 text-accent text-[11px] font-semibold uppercase tracking-widest mb-6">
                {product.offer.label}
              </span>
            )}
            <m.p
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 14 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              viewport={{ once: true }}
              className="text-lg text-ink-muted leading-relaxed mb-8 max-w-xl"
            >
              {product.fullDescription}
            </m.p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-ink-muted">
                <span className="font-medium text-ink">Категория:</span>
                <span>{product.category}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-ink-muted">
                <span className="font-medium text-ink">Остаток:</span>
                <span className={`font-medium ${product.stock <= 3 ? "text-accent" : "text-ink"}`}>
                  {product.stock} шт.
                </span>
              </div>
              <div className="border-t border-mist pt-4 flex items-baseline gap-2">
                {product.originalPrice && product.originalPrice !== product.price && (
                  <span className="serif text-lg font-light text-ink-muted line-through">
                    {product.originalPrice.toLocaleString("ru-RU")} ₽
                  </span>
                )}
                <span className="serif text-2xl font-light text-ink">
                  {product.price.toLocaleString("ru-RU")} ₽
                </span>
                <span className="text-xs text-ink-muted">за штуку</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setQuantity((q: number) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || product.stock <= 0}
                className="w-10 h-10 rounded-full border border-mist flex items-center justify-center text-sm font-bold text-ink hover:bg-mist-strong disabled:opacity-40 transition-colors"
              >
                <Minus size={16} strokeWidth={2} />
              </button>
              <span className="w-8 text-center text-sm font-medium text-ink">
                {quantity}
              </span>
              <button
                onClick={() => {
                  if (product.stock > 0 && quantity < product.stock) {
                    setQuantity((q: number) => q + 1);
                  }
                }}
                disabled={quantity >= product.stock || product.stock <= 0}
                className="w-10 h-10 rounded-full border border-mist flex items-center justify-center text-sm font-bold text-ink hover:bg-mist-strong disabled:opacity-40 transition-colors"
              >
                <Plus size={16} strokeWidth={2} />
              </button>
              <button
                onClick={handleAdd}
                disabled={product.stock <= 0 || added}
                className="flex-1 py-3.5 rounded-full bg-accent text-bg text-sm font-medium tracking-wide uppercase hover:bg-accent-hover disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} strokeWidth={2} />
                {added ? "В корзине" : product.stock <= 0 ? "Нет в наличии" : "В корзину"}
              </button>
            </div>
            <div className="mt-8 pt-6 border-t border-mist">
              <h3 className="serif text-lg font-light tracking-[0.08em] text-ink mb-3">
                История аромата
              </h3>
              <p className="text-ink-muted leading-relaxed max-w-lg">
                {product.legend}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {notes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1.5 rounded-full border border-sky/40 text-accent text-[11px] font-medium uppercase tracking-wider"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h3 className="serif text-xl font-light tracking-[0.08em] text-ink mb-4">Отзывы</h3>
          <ReviewsBlock productId={String(product.id)} />
        </div>
        <RelatedProducts products={products} excludeId={product.id} />
      </div>
    </section>
    </>
  );
}
