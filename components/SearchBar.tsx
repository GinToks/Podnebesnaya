"use client";
import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по названию и нотам…"
        className="w-full px-4 py-2.5 pl-10 rounded-full bg-mist border border-mist text-sm text-ink focus:border-sky outline-none transition-colors placeholder:text-ink-muted"
      />
    </div>
  );
}
