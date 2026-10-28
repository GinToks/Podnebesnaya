import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Review" ("id" TEXT NOT NULL PRIMARY KEY, "productId" TEXT NOT NULL, "authorName" TEXT NOT NULL, "rating" INTEGER NOT NULL, "text" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}
}

export async function GET(req: NextRequest) {
  await ensureTable();
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  await ensureTable();
  const body = await req.json().catch(() => ({}));
  const productId = String(body.productId || "");
  const authorName = String(body.authorName || "").trim();
  const rating = Number(body.rating);
  const text = String(body.text || "").trim();
  if (!productId || !authorName || !text || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const review = await prisma.review.create({
    data: { productId, authorName, rating, text },
  });
  return NextResponse.json(review, { status: 201 });
}
