import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/customerAuth";
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
  const token = req.cookies.get("customer_session")?.value;
  const email = token ? verifySessionToken(token) : null;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const verified = (customer as { emailVerified?: boolean }).emailVerified ?? false;
  if (verified) return NextResponse.json({ ok: true, alreadyVerified: true });
  const newToken = globalThis.crypto.randomUUID();
  await prisma.$executeRawUnsafe(`UPDATE "Customer" SET "verifyToken" = $1 WHERE "email" = $2`, newToken, email);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const link = `${baseUrl}/verify?token=${newToken}`;
  await sendEmail({ to: email, subject: "Подтвердите email — Поднебесная", html: verificationEmailHtml(link, email) });
  return NextResponse.json({ ok: true });
}
