import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey } from "@/lib/rateLimit";
import { verifyPassword, createSessionToken } from "@/lib/customerAuth";
import { customerLoginSchema } from "@/lib/validations";

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
  const body = await req.json().catch(() => ({}));
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const emailForLimit = String(body.email || "").trim().toLowerCase();
  if (!(await rateLimit(`customer-login:${ip}:${emailForLimit}`, 5, 15 * 60 * 1000))) {
    return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
  }
  const parsed = customerLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !verifyPassword(password, customer.password)) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }
  const token = createSessionToken(customer.email);
  const res = NextResponse.json({ ok: true, email: customer.email, name: customer.name });
  res.cookies.set("customer_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 30 * 24 * 60 * 60 });
  return res;
}
