import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

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
  const rows: any[] = await prisma.$queryRawUnsafe(`SELECT "id","email","name","createdAt","emailVerified","subscriptionActive","subscriptionMonths","subscriptionUntil" FROM "Customer" ORDER BY "createdAt" DESC`);
  // orders count per customer email
  let countMap: Record<string, number> = {};
  try {
    const allOrders = await prisma.order.findMany({ select: { customerEmail: true } });
    for (const o of allOrders) {
      countMap[o.customerEmail] = (countMap[o.customerEmail] || 0) + 1;
    }
  } catch {}
  const users = rows.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    createdAt: r.createdAt,
    emailVerified: r.emailVerified === true || r.emailVerified === "t" || r.emailVerified === 1,
    subscriptionActive: r.subscriptionActive === true || r.subscriptionActive === "t" || r.subscriptionActive === 1,
    subscriptionMonths: r.subscriptionMonths ?? null,
    subscriptionUntil: r.subscriptionUntil ?? null,
    ordersCount: countMap[r.email] || 0,
  }));
  return NextResponse.json(users);
}