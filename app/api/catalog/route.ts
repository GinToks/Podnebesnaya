import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";

async function ensureProductColumns() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "costPrice" INTEGER`);
  } catch {}
}

export async function GET() {
  await ensureProductColumns();
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });

  if (products.length === 0) {
    const { products: seedProducts } = await import("@/data/products");
    for (const p of seedProducts) {
      await prisma.product.create({
        data: {
          id: p.id,
          name: p.name,
          description: p.description,
          fullDescription: p.fullDescription,
          price: p.price,
          category: p.category,
          legend: p.legend,
          accent: p.accent,
          stock: p.stock,
          images: JSON.stringify(p.images),
          notes: JSON.stringify(p.notes),
          offer: p.offer ? JSON.stringify(p.offer) : null,
          originalPrice: p.originalPrice ?? null,
          discountPercent: p.discountPercent ?? null,
        },
      });
    }
    const seeded = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(seeded.map(parseProduct));
  }

  return NextResponse.json(products.map(parseProduct), {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

function parseProduct(p: Record<string, unknown>) {
  return {
    ...p,
    images: JSON.parse(String(p.images)),
    notes: JSON.parse(String(p.notes)),
    offer: p.offer ? JSON.parse(String(p.offer)) : undefined,
  };
}

export async function POST(req: NextRequest) {
  await ensureProductColumns();
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const id = body.id || data.name.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-");
  const product = await prisma.product.create({
    data: {
      id,
      name: data.name,
      description: data.description,
      fullDescription: data.fullDescription,
      price: data.price,
      costPrice: data.costPrice ?? null,
      category: data.category,
      legend: data.legend,
      accent: data.accent,
      stock: data.stock,
      images: JSON.stringify(data.images),
      notes: JSON.stringify(data.notes),
      offer: data.offer ? JSON.stringify(data.offer) : null,
      originalPrice: data.originalPrice ?? null,
      discountPercent: data.discountPercent ?? null,
    },
  });
  return NextResponse.json(parseProduct(product), { status: 201 });
}

export async function PUT(req: NextRequest) {
  await ensureProductColumns();
  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { id, ...patch } = parsed.data as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  if (patch.name !== undefined) data.name = patch.name;
  if (patch.description !== undefined) data.description = patch.description;
  if (patch.fullDescription !== undefined) data.fullDescription = patch.fullDescription;
  if (patch.price !== undefined) data.price = Number(patch.price);
  if (patch.costPrice !== undefined) data.costPrice = patch.costPrice === null ? null : Number(patch.costPrice);
  if (patch.category !== undefined) data.category = patch.category;
  if (patch.legend !== undefined) data.legend = patch.legend;
  if (patch.accent !== undefined) data.accent = patch.accent;
  if (patch.stock !== undefined) data.stock = Number(patch.stock);
  if (patch.images !== undefined) data.images = JSON.stringify(patch.images);
  if (patch.notes !== undefined) data.notes = JSON.stringify(patch.notes);
  if (patch.offer !== undefined) data.offer = patch.offer ? JSON.stringify(patch.offer) : null;
  if (patch.originalPrice !== undefined) data.originalPrice = patch.originalPrice;
  if (patch.discountPercent !== undefined) data.discountPercent = patch.discountPercent;

  // Save version snapshot before update
  try {
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ProductHistory" ("id" TEXT NOT NULL PRIMARY KEY, "productId" TEXT NOT NULL, "snapshot" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    const current = await prisma.product.findUnique({ where: { id: String(id) } });
    if (current) {
      await prisma.$executeRawUnsafe(`INSERT INTO "ProductHistory" ("id","productId","snapshot") VALUES ($1,$2,$3)`, globalThis.crypto.randomUUID(), String(id), JSON.stringify(current));
    }
  } catch {}

  const product = await prisma.product.update({ where: { id: String(id) }, data: data as never });
  return NextResponse.json(parseProduct(product));
}

export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}