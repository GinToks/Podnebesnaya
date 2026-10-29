"use client";
import { useState } from "react";
import { Filter } from "lucide-react";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onChange: (range: { min: number; max: number }) => void;
}

export default function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeFilterProps) {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-medium text-ink/80">
        <Filter size={14} strokeWidth={1.5} />
        <span>Цена, ₽</span>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          value={min}
          onChange={(e) => {
            const v = Number(e.target.value);
            setMin(isNaN(v) ? minPrice : v);
            onChange({ min: isNaN(v) ? minPrice : v, max });
          }}
          className="w-20 px-3 py-2 rounded bg-mist border border-mist text-sm text-ink focus:border-sky outline-none transition-colors"
        />
        <span className="text-[10px] text-ink-muted">—</span>
        <input
          type="number"
          value={max}
          onChange={(e) => {
            const v = Number(e.target.value);
            setMax(isNaN(v) ? maxPrice : v);
            onChange({ min, max: isNaN(v) ? maxPrice : v });
          }}
          className="w-20 px-3 py-2 rounded bg-mist border border-mist text-sm text-ink focus:border-sky outline-none transition-colors"
        />
      </div>
    </div>
  );
}
