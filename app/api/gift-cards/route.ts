import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { giftCardCreateSchema } from "@/lib/validations";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "GiftCard" ("code" TEXT NOT NULL PRIMARY KEY, "initialAmount" INTEGER NOT NULL, "balance" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
    await prisma.$executeRawUnsafe(`ALTER TABLE "GiftCard" ADD COLUMN IF NOT EXISTS "recipientName" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "GiftCard" ADD COLUMN IF NOT EXISTS "recipientEmail" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "GiftCard" ADD COLUMN IF NOT EXISTS "message" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "GiftCard" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT TRUE`);
  } catch {}
}

async function isAdmin() {
  try {
    const c = await cookies();
    const token = c.get("admin_token")?.value;
    if (!token) return false;
    return await verifyToken(token);
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTable();
  const cards = await prisma.giftCard.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(cards);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTable();
  const body = await req.json().catch(() => ({}));
  const parsed = giftCardCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const amount = parsed.data.amount;
  const code = parsed.data.code || `GC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const card = await prisma.giftCard.create({
    data: { code, initialAmount: amount, balance: amount },
  });
  return NextResponse.json(card, { status: 201 });
}
