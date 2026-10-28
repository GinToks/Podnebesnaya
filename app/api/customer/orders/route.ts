import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/customerAuth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("customer_session")?.value;
  const email = token ? verifySessionToken(token) : null;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orders = await prisma.order.findMany({
    where: { customerEmail: email },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders.map((o: any) => ({ ...o, items: safeParse(o.items) })));
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return []; }
}
