"use client";

import { useEffect, useState } from "react";
import { useCatalogStore } from "@/store/catalogStore";
import { useScentCalendarStore } from "@/store/scentCalendarStore";
import ScentCalendarTab from "@/components/admin/ScentCalendarTab";

export default function AdminScentCalendarPage() {
  const { products, fetchProducts } = useCatalogStore();
  const { entries: scentEntries, setScent, removeScent } = useScentCalendarStore();
  const [scentDate, setScentDate] = useState("");
  const [scentProductId, setScentProductId] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ScentCalendarTab
      products={products}
      scentDate={scentDate}
      setScentDate={setScentDate}
      scentProductId={scentProductId}
      setScentProductId={setScentProductId}
      scentEntries={scentEntries}
      setScent={setScent}
      removeScent={removeScent}
    />
  );
}