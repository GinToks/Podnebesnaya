import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { generateSecret, verifyTotp, otpAuthUrl } from "@/lib/totp";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "AdminSetting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
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

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTable();
  const body = await req.json().catch(() => ({}));
  const action = body.action;

  if (action === "setup") {
    const secret = generateSecret();
    await prisma.adminSetting.upsert({
      where: { key: "admin_totp_secret" },
      update: { value: secret },
      create: { key: "admin_totp_secret", value: secret },
    });
    return NextResponse.json({ secret, url: otpAuthUrl(secret) });
  }

  if (action === "verify") {
    const row = await prisma.adminSetting.findUnique({ where: { key: "admin_totp_secret" } });
    if (!row?.value) return NextResponse.json({ error: "2FA not set up" }, { status: 400 });
    if (!verifyTotp(row.value, body.code || "")) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "disable") {
    await prisma.adminSetting.delete({ where: { key: "admin_totp_secret" } }).catch(() => {});
    return NextResponse.json({ success: true });
  }

  if (action === "status") {
    const row = await prisma.adminSetting.findUnique({ where: { key: "admin_totp_secret" } });
    return NextResponse.json({ enabled: !!row?.value });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
