import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Customer" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL, "name" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "verifyToken" TEXT`);
  } catch {}
}

export async function GET(req: NextRequest) {
  await ensureTable();
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT "email" FROM "Customer" WHERE "verifyToken" = $1 LIMIT 1`,
    token
  )) as { email: string }[];
  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: "Неверный или устаревший токен" }, { status: 400 });
  }
  const email = rows[0].email;
  await prisma.$executeRawUnsafe(`UPDATE "Customer" SET "emailVerified" = TRUE, "verifyToken" = NULL WHERE "email" = $1`, email);
  return NextResponse.json({ ok: true, email });
}
