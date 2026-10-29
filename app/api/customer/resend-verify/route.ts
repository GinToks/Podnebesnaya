import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/customerAuth";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Customer" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL, "name" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "verifyToken" TEXT`);
  } catch {}
}

export async function POST(req: NextRequest) {
  await ensureTable();
  const token = req.cookies.get("customer_session")?.value;
  const email = token ? verifySessionToken(token) : null;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    await prisma.$executeRawUnsafe(`UPDATE "Customer" SET "emailVerified" = TRUE, "verifyToken" = NULL WHERE "email" = $1`, email);
  } catch {}
  return NextResponse.json({ ok: true, alreadyVerified: true });
}
