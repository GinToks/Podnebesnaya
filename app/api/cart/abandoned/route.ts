import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "AdminSetting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
  } catch {}
}

export async function POST(req: NextRequest) {
  await ensureTable();
  const body = await req.json().catch(() => ({}));
  const items = Array.isArray(body.items) ? body.items : [];
  const row = await prisma.adminSetting.findUnique({ where: { key: "messenger_settings" } });
  let settings = { tgToken: "", tgChatId: "" };
  if (row?.value) { try { settings = { ...settings, ...JSON.parse(row.value) }; } catch {} }
  if (!settings.tgToken || !settings.tgChatId) return NextResponse.json({ skipped: true });

  const itemsText = items.map((i: any) => `• ${i.productName} x${i.quantity}`).join("\n");
  const message = `🛒 Брошенная корзина\nТовары:\n${itemsText}`;
  try {
    await fetch(`https://api.telegram.org/bot${settings.tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: settings.tgChatId, text: message }),
    });
  } catch {}
  return NextResponse.json({ ok: true });
}
