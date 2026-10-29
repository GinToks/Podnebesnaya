import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { rateLimit, getRateLimitKey } from "@/lib/rateLimit";

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && (await verifyToken(token));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate limiting for all API routes
  if (pathname.startsWith("/api/")) {
    const key = getRateLimitKey(req, pathname);
    if (!(await rateLimit(key, 60, 60000))) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  // Protect /admin pages (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Admin-only API surfaces (all methods)
  if (pathname.startsWith("/api/settings")) {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  if (pathname.startsWith("/api/gift-cards") && !pathname.startsWith("/api/gift-cards/check") && !pathname.startsWith("/api/gift-cards/redeem")) {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Banners: mutations require admin (GET public)
  if (pathname.startsWith("/api/banners") && req.method !== "GET") {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Catalog: mutations require admin
  if (pathname.startsWith("/api/catalog") && req.method !== "GET") {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Orders: GET requires admin; PATCH/DELETE admin; POST public
  if (pathname.startsWith("/api/orders") && (req.method === "GET" || req.method === "PATCH" || req.method === "DELETE")) {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Reviews: DELETE requires admin
  if (pathname.startsWith("/api/reviews") && req.method === "DELETE") {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Auth password change requires admin
  if (pathname.startsWith("/api/auth/change-password")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // CSRF protection for mutating requests: require Origin matching host (and app URL if configured)
  if (pathname.startsWith("/api/") && req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    let originHost = "";
    let originProtocol = "";
    try {
      const u = new URL(origin || "");
      originHost = u.hostname;
      originProtocol = u.protocol;
    } catch {
      originHost = "";
    }
    const hostName = (host || "").split(":")[0];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    let allowed = false;
    if (origin && host && originHost === hostName) {
      // In production require https origins
      if (process.env.NODE_ENV !== "production" || originProtocol === "https:") {
        allowed = true;
      }
    }
    if (appUrl) {
      try {
        if (origin === new URL(appUrl).origin) allowed = true;
      } catch {}
    }
    if (!allowed) {
      return NextResponse.json({ error: "CSRF blocked" }, { status: 403 });
    }
  }

  // Audit log for admin API mutations (dev only)
  if (process.env.NODE_ENV !== "production" && pathname.startsWith("/api/") && req.method !== "GET" && req.method !== "HEAD") {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    console.info(JSON.stringify({ audit: true, ts: new Date().toISOString(), method: req.method, path: pathname, ip }));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
