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

export async function POST(req: NextRequest) {
  await ensureTable();
  const token = req.cookies.get("customer_session")?.value;
  const email = token ? verifySessionToken(token) : null;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const amount = Number(body.amount) || 0;
  if (amount <= 0) return NextResponse.json({ error: "invalid amount" }, { status: 400 });
  const recipientName = String(body.recipientName || "").trim();
  const recipientEmail = String(body.recipientEmail || email).trim().toLowerCase();
  const message = String(body.message || "").trim();
  const code = `GC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  await prisma.$executeRawUnsafe(
    `INSERT INTO "GiftCard" ("code","initialAmount","balance","recipientName","recipientEmail","message","active") VALUES ($1,$2,$3,$4,$5,$6,TRUE)`,
    code, amount, amount, recipientName || null, recipientEmail, message || null
  );
  return NextResponse.json({ code, amount, recipientEmail }, { status: 201 });
}