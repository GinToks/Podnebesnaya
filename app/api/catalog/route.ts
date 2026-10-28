import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson, CATALOG_FILE } from "@/lib/storage";
import type { Product } from "@/data/products";

export async function GET() {
  const products = await readJson<Product[]>(CATALOG_FILE, []);
  // If no persisted catalog, seed from data file
  if (products.length === 0) {
    const { products: seedProducts } = await import("@/data/products");
    await writeJson(CATALOG_FILE, seedProducts);
    return NextResponse.json(seedProducts);
  }
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const products = await readJson<Product[]>(CATALOG_FILE, []);
  const newProduct: Product = {
    ...body,
    id: body.id || body.name.toLowerCase().replace(/[^\\w\\s-]/g, "").trim().replace(/[\\s_-]+/g, "-"),
  };
  products.push(newProduct);
  await writeJson(CATALOG_FILE, products);
  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, ...patch } = await req.json();
  const products = await readJson<Product[]>(CATALOG_FILE, []);
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  products[idx] = { ...products[idx], ...patch };
  await writeJson(CATALOG_FILE, products);
  return NextResponse.json(products[idx]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const products = await readJson<Product[]>(CATALOG_FILE, []);
  const filtered = products.filter((p) => p.id !== id);
  await writeJson(CATALOG_FILE, filtered);
  return NextResponse.json({ success: true });
}
