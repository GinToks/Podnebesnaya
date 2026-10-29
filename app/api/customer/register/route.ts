import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken } from "@/lib/customerAuth";
import { customerRegisterSchema } from "@/lib/validations";
import { sendEmail, verificationEmailHtml } from "@/lib/email";

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
  const parsed = customerRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;
  const name = (parsed.data.name || "").trim();
  const exists = await prisma.customer.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Такой email уже зарегистрирован" }, { status: 409 });
  const verifyToken = globalThis.crypto.randomUUID();
  const customer = await prisma.customer.create({
    data: { email, password: hashPassword(password), name: name || null },
  });
  try {
    await prisma.$executeRawUnsafe(`UPDATE "Customer" SET "verifyToken" = $1 WHERE "email" = $2`, verifyToken, email);
  } catch {}
  // Send verification email (webhook if configured, otherwise log in dev)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const link = `${baseUrl}/verify?token=${verifyToken}`;
  await sendEmail({ to: email, subject: "Подтвердите email — Поднебесная", html: verificationEmailHtml(link, email) });
  const token = createSessionToken(customer.email);
  const res = NextResponse.json({ ok: true, email: customer.email, name: customer.name, emailVerified: false });
  res.cookies.set("customer_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 30 * 24 * 60 * 60 });
  return res;
}
