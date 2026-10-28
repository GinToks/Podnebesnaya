import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const row = await prisma.adminSetting.findUnique({ where: { key: "messenger_settings" } });
    if (!row) return NextResponse.json({ hasRow: false });
    const s = JSON.parse(row.value);
    return NextResponse.json({ hasRow: true, tgTokenLength: (s.tgToken || "").length, tgChatId: s.tgChatId || "", waNumber: s.waNumber || "" });
  } catch (e) {
    return NextResponse.json({ error: String(e) });
  }
}
