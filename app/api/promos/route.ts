import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { promoCodes } from "@/data/products";

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PromoCode" (
        "code" TEXT NOT NULL PRIMARY KEY,
        "type" TEXT NOT NULL,
        "value" DOUBLE PRECISION NOT NULL,
        "maxUses" INTEGER NOT NULL,
        "usedCount" INTEGER NOT NULL DEFAULT 0,
        "active" BOOLEAN NOT NULL DEFAULT TRUE,
        "label" TEXT NOT NULL DEFAULT '',
        "expiresAt" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
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

function rowToPromo(r: any) {
  return {
    code: r.code,
    type: r.type,
    value: Number(r.value),
    maxUses: Number(r.maxUses),
    usedCount: Number(r.usedCount),
    active: r.active === true || r.active === "t" || r.active === 1,
    label: r.label || "",
    expiresAt: r.expiresAt || undefined,
  };
}

export async function GET() {
  await ensureTable();
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS c FROM "PromoCode"`);
    const cnt = rows?.[0]?.c ?? 0;
    if (cnt === 0) {
      for (const c of promoCodes) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "PromoCode" ("code","type","value","maxUses","usedCount","active","label","expiresAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT ("code") DO NOTHING`,
          c.code, c.type, c.value, c.maxUses, c.usedCount, c.active, c.label, c.expiresAt || null
        ).catch(() => {});
      }
    }
  } catch {}
  const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "PromoCode" ORDER BY "createdAt" DESC`);
  return NextResponse.json(rows.map(rowToPromo));
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTable();
  const body = await req.json().catch(() => ({}));
  const code = String(body.code || "").trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
  await prisma.$executeRawUnsafe(
    `INSERT INTO "PromoCode" ("code","type","value","maxUses","usedCount","active","label","expiresAt") VALUES ($1,$2,$3,$4,0,$5,$6,$7)`,
    code,
    body.type === "fixed" ? "fixed" : "percent",
    Number(body.value) || 0,
    Number(body.maxUses) || 1,
    body.active !== false,
    String(body.label || ""),
    body.expiresAt || null
  );
  const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "PromoCode" WHERE "code" = $1`, code);
  return NextResponse.json(rowToPromo(rows[0]), { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTable();
  const body = await req.json().catch(() => ({}));
  const code = String(body.code || "").trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
  const sets: string[] = [];
  const vals: any[] = [];
  let i = 1;
  if (body.type !== undefined) { sets.push(`"type" = $${i++}`); vals.push(body.type === "fixed" ? "fixed" : "percent"); }
  if (body.value !== undefined) { sets.push(`"value" = $${i++}`); vals.push(Number(body.value)); }
  if (body.maxUses !== undefined) { sets.push(`"maxUses" = $${i++}`); vals.push(Number(body.maxUses)); }
  if (body.active !== undefined) { sets.push(`"active" = $${i++}`); vals.push(!!body.active); }
  if (body.label !== undefined) { sets.push(`"label" = $${i++}`); vals.push(String(body.label)); }
  if (body.expiresAt !== undefined) { sets.push(`"expiresAt" = $${i++}`); vals.push(body.expiresAt || null); }
  if (body.usedCount !== undefined) { sets.push(`"usedCount" = $${i++}`); vals.push(Number(body.usedCount)); }
  if (sets.length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  vals.push(code);
  await prisma.$executeRawUnsafe(`UPDATE "PromoCode" SET ${sets.join(", ")} WHERE "code" = $${i}`, ...vals);
  const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "PromoCode" WHERE "code" = $1`, code);
  return NextResponse.json(rowToPromo(rows[0]));
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTable();
  const body = await req.json().catch(() => ({}));
  const code = String(body.code || "").trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
  await prisma.$executeRawUnsafe(`DELETE FROM "PromoCode" WHERE "code" = $1`, code);
  return NextResponse.json({ ok: true });
}