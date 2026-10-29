import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey } from "@/lib/rateLimit";
import { giftCardRedeemSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  if (!(await rateLimit(getRateLimitKey(req, "giftcard-redeem"), 5, 60000))) {
    return NextResponse.json({ error: "Слишком много запросов" }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = giftCardRedeemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const code = parsed.data.code.trim();
  const amount = parsed.data.amount;

  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "GiftCard" ("code" TEXT NOT NULL PRIMARY KEY, "initialAmount" INTEGER NOT NULL, "balance" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}

  const rows: any[] = await prisma.$queryRawUnsafe(
    `UPDATE "GiftCard" SET balance = balance - $1 WHERE code = $2 AND balance >= $1 RETURNING *`,
    amount,
    code
  );

  if (!rows || rows.length === 0) {
    const card = await prisma.giftCard.findUnique({ where: { code } });
    if (!card) return NextResponse.json({ error: "Карта не найдена" }, { status: 404 });
    return NextResponse.json({ error: "Недостаточно средств", balance: card.balance }, { status: 400 });
  }

  return NextResponse.json({ success: true, balance: rows[0].balance, deducted: amount });
}
