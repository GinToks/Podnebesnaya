import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/customerAuth";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Customer" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL, "name" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "verifyToken" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "subscriptionMonths" INTEGER`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "subscriptionUntil" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "subscriptionActive" BOOLEAN NOT NULL DEFAULT FALSE`);
  } catch {}
}

function getSessionEmail(req: NextRequest): string | null {
  const token = req.cookies.get("customer_session")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  await ensureTable();
  const email = getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows: any[] = await prisma.$queryRawUnsafe(`SELECT "subscriptionMonths", "subscriptionUntil", "subscriptionActive" FROM "Customer" WHERE "email" = $1`, email);
  const r = rows?.[0];
  return NextResponse.json({
    active: r?.subscriptionActive === true || r?.subscriptionActive === "t" || r?.subscriptionActive === 1,
    months: r?.subscriptionMonths ?? null,
    until: r?.subscriptionUntil ?? null,
  });
}

export async function POST(req: NextRequest) {
  await ensureTable();
  const email = getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const months = Number(body.months) || 1;
  const until = new Date();
  until.setMonth(until.getMonth() + months);
  await prisma.$executeRawUnsafe(
    `UPDATE "Customer" SET "subscriptionMonths" = $1, "subscriptionUntil" = $2, "subscriptionActive" = TRUE WHERE "email" = $3`,
    months, until.toISOString(), email
  );
  return NextResponse.json({ ok: true, months, until: until.toISOString() });
}

export async function DELETE(req: NextRequest) {
  await ensureTable();
  const email = getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.$executeRawUnsafe(
    `UPDATE "Customer" SET "subscriptionActive" = FALSE WHERE "email" = $1`, email
  );
  return NextResponse.json({ ok: true });
}