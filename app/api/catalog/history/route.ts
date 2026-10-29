import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

async function isAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && (await verifyToken(token));
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  try {
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ProductHistory" ("id" TEXT NOT NULL PRIMARY KEY, "productId" TEXT NOT NULL, "snapshot" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    const rows = (await prisma.$queryRawUnsafe(
      `SELECT "id","productId","snapshot","createdAt" FROM "ProductHistory" WHERE "productId" = $1 ORDER BY "createdAt" DESC LIMIT 50`,
      productId
    )) as { id: string; productId: string; snapshot: string; createdAt: Date }[];
    return NextResponse.json(rows.map((r) => ({ ...r, snapshot: JSON.parse(r.snapshot) })));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
