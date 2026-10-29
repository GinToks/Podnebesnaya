import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

async function isAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && (await verifyToken(token));
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const historyId = body.historyId;
  if (!historyId) return NextResponse.json({ error: "historyId required" }, { status: 400 });
  try {
    const rows = (await prisma.$queryRawUnsafe(
      `SELECT "snapshot" FROM "ProductHistory" WHERE "id" = $1 LIMIT 1`,
      historyId
    )) as { snapshot: string }[];
    if (!rows || rows.length === 0) return NextResponse.json({ error: "not found" }, { status: 404 });
    const snapshot = JSON.parse(rows[0].snapshot) as Record<string, unknown>;
    const { id, createdAt, updatedAt, ...data } = snapshot;
    await prisma.product.update({ where: { id: String(id) }, data: data as never });
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
