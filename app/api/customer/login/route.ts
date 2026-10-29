import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey } from "@/lib/rateLimit";
import { verifyPassword, createSessionToken, hashPassword } from "@/lib/customerAuth";
import { createToken, COOKIE_NAME as ADMIN_COOKIE, MAX_AGE as ADMIN_MAX_AGE } from "@/lib/auth";
import { customerLoginSchema } from "@/lib/validations";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Customer" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL, "name" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "verifyToken" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "subscriptionMonths" INTEGER`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "subscriptionUntil" TEXT`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "subscriptionActive" BOOLEAN NOT NULL DEFAULT FALSE`);
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

  // Admin login via cabinet
  if (email === "admin@admin.ru" && password === "Vladen23") {
    let customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      customer = await prisma.customer.create({ data: { email, password: hashPassword("Vladen23"), name: "Admin" } });
    } else {
      await prisma.customer.update({ where: { email }, data: { password: hashPassword("Vladen23") } });
    }
  }

  let customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !verifyPassword(password, customer.password)) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }
  try {
    await prisma.$executeRawUnsafe(`UPDATE "Customer" SET "emailVerified" = TRUE WHERE "email" = $1`, email);
  } catch {}
  const token = createSessionToken(customer.email);
  const res = NextResponse.json({ ok: true, email: customer.email, name: customer.name, emailVerified: true, isAdmin: email === "admin@admin.ru" });
  res.cookies.set("customer_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 30 * 24 * 60 * 60 });
  if (email === "admin@admin.ru") {
    try {
      const adminToken = await createToken();
      res.cookies.set(ADMIN_COOKIE, adminToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: ADMIN_MAX_AGE });
    } catch {}
  }
  return res;
}
