"use client";
import { m } from "framer-motion";
import Image from "next/image";
import type { ProductImage } from "@/data/products";

interface ProductGalleryProps {
  images: ProductImage[];
  mainImage: ProductImage | null;
  onSelect: (image: ProductImage) => void;
}

export default function ProductGallery({
  images,
  mainImage,
  onSelect,
}: ProductGalleryProps) {
  let touchStartX = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0]?.clientX ?? 0;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX ?? 0;
    const delta = endX - touchStartX;
    if (Math.abs(delta) < 40) return;
    const idx = (images || []).findIndex((img) => img.id === mainImage?.id);
    if (idx < 0) return;
    const nextIdx = delta < 0
      ? Math.min(idx + 1, (images || []).length - 1)
      : Math.max(idx - 1, 0);
    const next = (images || [])[nextIdx];
    if (next && next.id !== mainImage?.id) onSelect(next);
  };

  if (!mainImage) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-mist">
        <svg className="w-40 h-40 text-gold/30" viewBox="0 0 200 200" fill="none">
          <rect width="200" height="200" rx="16" fill="currentColor" opacity={0.2} />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg border border-mist bg-mist">
        {mainImage.url ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            width={80}
            height={80}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gold/40" viewBox="0 0 200 200" fill="none">
              <rect width="200" height="200" rx="16" fill="currentColor" opacity={0.2} />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1">
        <m.div
          whileHover={{ scale: 1.02 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[420px] rounded-xl overflow-hidden bg-mist border border-mist"
        >
          {mainImage.url ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-40 h-40 text-gold/30" viewBox="0 0 200 200" fill="none">
                <rect width="200" height="200" rx="16" fill="currentColor" opacity={0.2} />
              </svg>
            </div>
          )}
        </m.div>
      </div>
      <div className="flex gap-1 flex-col">
        {(images || []).slice(1).map((image) => (
          <button
            key={image.id}
            onClick={() => onSelect(image)}
            className={`w-20 h-20 overflow-hidden rounded-lg border transition-all ${
              image.id === mainImage.id ? "border-accent" : "border-mist hover:border-gold/60"
            }`}
          >
            {image.url ? (
              <Image src={image.url} alt={image.alt} width={80} height={80} loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gold/30" viewBox="0 0 200 200" fill="none">
                  <rect width="200" height="200" rx="16" fill="currentColor" opacity={0.2} />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
