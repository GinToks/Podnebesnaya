import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken } from "@/lib/customerAuth";

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
  const name = String(body.name || "").trim();
  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "Введите email и пароль (от 6 символов)" }, { status: 400 });
  }
  const exists = await prisma.customer.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Такой email уже зарегистрирован" }, { status: 409 });
  const customer = await prisma.customer.create({
    data: { email, password: hashPassword(password), name: name || null },
  });
  const token = createSessionToken(customer.email);
  const res = NextResponse.json({ ok: true, email: customer.email, name: customer.name });
  res.cookies.set("customer_session", token, { httpOnly: true, path: "/", maxAge: 30 * 24 * 60 * 60 });
  return res;
}
