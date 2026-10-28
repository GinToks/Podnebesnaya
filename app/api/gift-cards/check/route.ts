import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = String(body.code || "").trim();
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "GiftCard" ("code" TEXT NOT NULL PRIMARY KEY, "initialAmount" INTEGER NOT NULL, "balance" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}
  const card = await prisma.giftCard.findUnique({ where: { code } });
  if (!card) return NextResponse.json({ valid: false, error: "Карта не найдена" }, { status: 404 });
  if (card.balance <= 0) return NextResponse.json({ valid: false, error: "Баланс исчерпан" }, { status: 400 });
  return NextResponse.json({ valid: true, balance: card.balance, code: card.code });
}
