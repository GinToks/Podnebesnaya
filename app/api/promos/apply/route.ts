import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PromoCode" (
        "code" TEXT NOT NULL PRIMARY KEY,
        "type" TEXT NOT NULL,
        "value" DOUBLE PRECISION NOT NULL,
        "maxUses" INTEGER NOT NULL,
        "usedCount" INTEGER NOT NULL DEFAULT 0,
        "active" BOOLEAN NOT NULL DEFAULT TRUE,
        "label" TEXT NOT NULL DEFAULT '',
        "expiresAt" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch {}
}

export async function POST(req: NextRequest) {
  await ensureTable();
  const body = await req.json().catch(() => ({}));
  const code = String(body.code || "").trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
  const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "PromoCode" WHERE "code" = $1`, code);
  const promo = rows?.[0];
  if (!promo) return NextResponse.json({ error: "invalid" }, { status: 404 });
  const active = promo.active === true || promo.active === "t" || promo.active === 1;
  if (!active) return NextResponse.json({ error: "invalid" }, { status: 404 });
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return NextResponse.json({ error: "expired" }, { status: 410 });
  if (Number(promo.usedCount) >= Number(promo.maxUses)) return NextResponse.json({ error: "exhausted" }, { status: 409 });
  await prisma.$executeRawUnsafe(`UPDATE "PromoCode" SET "usedCount" = "usedCount" + 1 WHERE "code" = $1`, code);
  const updated: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "PromoCode" WHERE "code" = $1`, code);
  const u = updated[0];
  return NextResponse.json({
    code: u.code,
    type: u.type,
    value: Number(u.value),
    maxUses: Number(u.maxUses),
    usedCount: Number(u.usedCount),
    active: u.active === true || u.active === "t" || u.active === 1,
    label: u.label || "",
    expiresAt: u.expiresAt || undefined,
  });
}