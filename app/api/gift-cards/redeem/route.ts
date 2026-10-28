import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = String(body.code || "").trim();
  const amount = Number(body.amount);
  if (!code || !amount || amount <= 0) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "GiftCard" ("code" TEXT NOT NULL PRIMARY KEY, "initialAmount" INTEGER NOT NULL, "balance" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}
  const card = await prisma.giftCard.findUnique({ where: { code } });
  if (!card) return NextResponse.json({ error: "Карта не найдена" }, { status: 404 });
  if (card.balance < amount) return NextResponse.json({ error: "Недостаточно средств", balance: card.balance }, { status: 400 });
  const updated = await prisma.giftCard.update({
    where: { code },
    data: { balance: card.balance - amount },
  });
  return NextResponse.json({ success: true, balance: updated.balance, deducted: amount });
}
