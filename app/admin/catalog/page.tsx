"use client";

import { useState, useEffect } from "react";
import { useCatalogStore } from "@/store/catalogStore";
import CatalogTab from "@/components/admin/CatalogTab";
import type { Product, ScentCategory, ScentNotes } from "@/data/products";

export default function AdminCatalogPage() {
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts, reorderProducts } =
    useCatalogStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Product> & { id?: string }>({});
  const [newOfferLabel, setNewOfferLabel] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const startAdd = () => {
    setEditingId("new");
    setDraft({
      name: "", description: "", fullDescription: "", price: 0,
      category: "fresh", legend: "", accent: "#C41E3A", stock: 0,
      offer: { label: "", active: false },
      images: [{ id: `img-${Date.now()}`, url: "", alt: "" }],
    });
    setNewOfferLabel("");
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setDraft({ ...product });
    setNewOfferLabel(product.offer?.label ?? "");
  };

  const saveDraft = async () => {
    if (!draft.name || !draft.description || draft.price == null) return;
    const product: Product = {
      id: draft.id ?? "",
      name: draft.name,
      description: draft.description,
      fullDescription: draft.fullDescription ?? "",
      notes: (draft.notes as ScentNotes) ?? { top: [], middle: [], base: [] },
      price: Number(draft.price) || 0,
      costPrice: draft.costPrice ?? undefined,
      category: (draft.category as ScentCategory) || "fresh",
      legend: draft.legend ?? "",
      accent: draft.accent || "#C41E3A",
      stock: Number(draft.stock) || 0,
      images: (draft.images as { id: string; url: string; alt: string }[]) ?? [{ id: "main", url: "", alt: draft.name ?? "" }],
      offer: newOfferLabel ? { label: newOfferLabel, active: true } : undefined,
      originalPrice: draft.originalPrice,
      discountPercent: draft.discountPercent,
    };
    if (editingId) {
      await updateProduct(editingId, product);
    } else {
      await addProduct(product as Omit<Product, "id">);
    }
    setEditingId(null);
    setDraft({});
    setNewOfferLabel("");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Удалить товар без возможности восстановления?")) {
      await deleteProduct(id);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const ctx = {
    products, filteredProducts, adminSearch, setAdminSearch, editingId, setEditingId,
    draft, setDraft, newOfferLabel, setNewOfferLabel, startAdd, startEdit, saveDraft,
    deleteProduct, updateProduct, addProduct, reorderProducts, seed: fetchProducts, selectedProducts,
    setSelectedProducts, draggedId, setDraggedId, handleDelete,
  };

  return <CatalogTab ctx={ctx} />;
}
