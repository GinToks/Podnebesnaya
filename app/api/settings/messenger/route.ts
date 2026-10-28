import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const KEY = "messenger_settings";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "AdminSetting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}
}

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && verifyToken(token);
}

export async function GET(req: NextRequest) {
  if (!(await auth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureTable();
  const row = await prisma.adminSetting.findUnique({ where: { key: KEY } });
  let settings = { tgToken: "", tgChatId: "", waNumber: "" };
  if (row?.value) {
    try { settings = { ...settings, ...JSON.parse(row.value) }; } catch {}
  }
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  if (!(await auth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const settings = {
    tgToken: String(body.tgToken || "").trim(),
    tgChatId: String(body.tgChatId || "").trim(),
    waNumber: String(body.waNumber || "").trim(),
  };
  await ensureTable();
  await prisma.adminSetting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(settings) },
    create: { key: KEY, value: JSON.stringify(settings) },
  });
  return NextResponse.json({ success: true });
}
