import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/customerAuth";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Customer" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL, "name" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}
}

export async function GET(req: NextRequest) {
  await ensureTable();
  const token = req.cookies.get("customer_session")?.value;
  const email = token ? verifySessionToken(token) : null;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ email: customer.email, name: customer.name });
}

export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("customer_session", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
