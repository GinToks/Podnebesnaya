import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey } from "@/lib/rateLimit";
import { reviewSchema } from "@/lib/validations";

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
  if (!(await rateLimit(getRateLimitKey(req, "reviews"), 10, 60000))) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }
  await ensureTable();
  const body = await req.json().catch(() => ({}));
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { productId, authorName, rating, text } = parsed.data;
  const review = await prisma.review.create({
    data: { productId, authorName, rating, text },
  });
  return NextResponse.json(review, { status: 201 });
}
