import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken } from "@/lib/customerAuth";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Customer" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL, "name" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}
}

export async function POST(req: NextRequest) {
  await ensureTable();
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !verifyPassword(password, customer.password)) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }
  const token = createSessionToken(customer.email);
  const res = NextResponse.json({ ok: true, email: customer.email, name: customer.name });
  res.cookies.set("customer_session", token, { httpOnly: true, path: "/", maxAge: 30 * 24 * 60 * 60 });
  return res;
}
