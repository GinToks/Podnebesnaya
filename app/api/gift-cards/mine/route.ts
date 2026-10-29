import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/customerAuth";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "GiftCard" ("code" TEXT NOT NULL PRIMARY KEY, "initialAmount" INTEGER NOT NULL, "balance" INTEGER NOT NULL, "recipientName" TEXT, "recipientEmail" TEXT, "message" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "active" BOOLEAN NOT NULL DEFAULT TRUE)`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "GiftCard" ADD COLUMN IF NOT EXISTS "recipientName" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "GiftCard" ADD COLUMN IF NOT EXISTS "recipientEmail" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "GiftCard" ADD COLUMN IF NOT EXISTS "message" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "GiftCard" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT TRUE`);
  } catch {}
}

export async function GET(req: NextRequest) {
  await ensureTable();
  const token = req.cookies.get("customer_session")?.value;
  const email = token ? verifySessionToken(token) : null;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "GiftCard" WHERE "recipientEmail" = $1 ORDER BY "createdAt" DESC`, email);
  return NextResponse.json(rows.map((r) => ({
    code: r.code,
    amount: Number(r.initialAmount),
    balance: Number(r.balance),
    recipientName: r.recipientName || "",
    recipientEmail: r.recipientEmail || "",
    message: r.message || "",
    createdAt: r.createdAt,
    active: r.active === true || r.active === "t" || r.active === 1,
  })));
}