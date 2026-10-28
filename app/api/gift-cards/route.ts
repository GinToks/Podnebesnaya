import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "GiftCard" ("code" TEXT NOT NULL PRIMARY KEY, "initialAmount" INTEGER NOT NULL, "balance" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
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
  const body = await req.json();
  const amount = Number(body.amount);
  if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  const code = body.code || `GC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const card = await prisma.giftCard.create({
    data: { code, initialAmount: amount, balance: amount },
  });
  return NextResponse.json(card, { status: 201 });
}
