# Security Audit — Podnebesnaya

Date: 2026-10-29  
Auditor: delegate_task (3 parallel subagents: security, TypeScript/data, frontend/perf)

## CRITICAL (fix before production)

| # | File | Lines | Issue | Recommendation |
|---|------|-------|-------|----------------|
| 1 | `app/api/gift-cards/redeem/route.ts` | 16–22 | **Gift card race condition**: read balance → check → update. Two parallel requests both pass and double-spend. | Atomic SQL: `UPDATE "GiftCard" SET balance = balance - $amount WHERE code = $code AND balance >= $amount RETURNING *` |
| 2 | `app/api/orders/route.ts` | 69–81 | **Client controls totalPrice**: field comes from client, stored without recalculation. Free orders possible. | Remove `totalPrice` from incoming schema; compute server-side from items + DB prices. |
| 3 | `middleware.ts` | 78–83 | **CSRF bypass via subdomain**: `origin.includes(host)` allows `evil-podnebesnaya.ru` for `host=podnebesnaya.ru`. | Strict comparison: `origin === host` or `new URL(origin).hostname === host`. |

## HIGH

| # | File | Lines | Issue | Recommendation |
|---|------|-------|-------|----------------|
| 4 | `app/api/auth/change-password/route.ts` | 24–25 | **Timing attack on admin password change**: `!==` instead of `crypto.timingSafeEqual`. | Use `timingSafeEqual` for hash comparison (see `customerAuth.ts`). |
| 5 | `lib/auth.ts`, `lib/customerAuth.ts`, `lib/adminPassword.ts` | 6–8, 6, 29 | **Hardcoded fallback secrets**: `change-me-in-production`, `podnebesnaya-customer-secret-change-me`, `admin123`. Allows JWT forgery and admin access. | Remove all fallbacks; reject requests if secrets missing. |
| 6 | `app/api/customer/login/route.ts` | 14–31 | **No brute-force protection**: global 60/min is insufficient; no per-email/per-IP limit or captcha. | Add rate limit on login (5 attempts / 15 min per IP/email). |
| 7 | `app/api/gift-cards/redeem/route.ts` | 5–24 | **No rate limit on gift card redeem**: allows brute-force card codes (60/min global). | Add strict per-IP limit (5/min) + per-card limit. |
| 8 | `lib/rateLimit.ts` | 50–54 | **Memory rateLimiter grows to 10000 keys** before cleanup; not DDoS-resistant. | Switch to Upstash Redis only; or add stricter TTL. |
| 9 | `lib/rateLimit.ts` | 68–72 | **IP from X-Forwarded-For without validation**: client can spoof header. | Validate `X-Forwarded-For` against trusted proxies; fallback to `req.ip`. |

## MEDIUM

| # | File | Lines | Issue | Recommendation |
|---|------|-------|-------|----------------|
| 10 | `app/api/catalog/route.ts` | 88–109 | PUT without zod; manual field mapping without type validation. | Add zod schema for PUT. |
| 11 | `app/api/banners/route.ts` | 63–93 | POST/PUT/DELETE without zod; accepts any JSON. | Add zod schema. |
| 12 | `app/api/orders/route.ts` | 149–163 | PATCH without trackingNumber validation; no try/catch on `req.json()`. | Add zod + try/catch. |
| 13 | `app/api/gift-cards/route.ts` | 35–37 | `amount` validated only via `Number()`, no zod. | Add zod `z.number().int().positive()`. |
| 14 | `app/api/orders/route.ts` | 41–47 | GET returns all orders without pagination. | Add cursor/offset pagination + limit. |
| 15 | `app/api/reviews/route.ts` | 24–36 | Open POST without auth or rate limit; XSS risk via `authorName`. | Require auth or add strict rate limit + sanitize input. |
| 16 | `app/api/customer/register/route.ts` | 14–33 | Registration without email verification. | Add email verification flow (magic link or OTP). |
| 17 | `app/api/orders/route.ts` | — | No `res.json` error wrapper; stack traces may leak in dev. | Standardize error response helper. |

## TypeScript / Data layer

| Severity | Count | Summary |
|----------|-------|---------|
| HIGH | 14 | `any` in admin tabs (`WishlistModal`, `GiftSets`, `CatalogTab`, `BannersTab`, `CollectionsTab`), API routes (`orders`, `banners`, `catalog`), stores (`orderStore`, `catalogStore`). |
| MEDIUM | 9 | `any` in `track/page.tsx`, `product/[id]/page.tsx`, `layout.tsx`, `cart/abandoned/route.ts`, `customer/orders/route.ts`, `CartDrawer.tsx`. |
| INFO | 4 | `prisma/seed.ts` missing (broken `db:seed` script); `CartDrawer.tsx` duplicates `orderSchema` locally with field name mismatch (`address` vs `customerAddress`); fire-and-forget fetch without `res.ok` in `SettingsTab.tsx`, `admin/page.tsx`. |

## Frontend / Performance

| Severity | Count | Summary |
|----------|-------|---------|
| CRITICAL | 3 | Monolithic `admin/page.tsx` (292 lines, all tabs in one component); `ProductCard.tsx` without `React.memo` in animated list; `CartDrawer.tsx` subscribes to 5 stores simultaneously. |
| HIGH | 4 | Root layout wraps all pages in 9 client providers (makes everything CSR); bundle initial >500 KB (Framer Motion 228 KB, React 163 KB); `Header.tsx` callbacks without `useCallback`; `CartDrawer.tsx` `setInterval` without `useRef`. |
| MEDIUM | 8 | `next.config.ts` missing `output:'standalone'`, `compress`, `optimizePackageImports`; `ProductCard.tsx` `next/image` missing `sizes`; `dangerouslySetInnerHTML` for JSON-LD without validation; `cursor:none` on body without touch fallback; SakuraPetals 40 particles on every page; `ErrorBoundary` class component (works but not idiomatic for React 19); `middleware.ts` audit log via `console.info` in production. |

## Remediation priority

1. Fix 3 CRITICAL security issues (redeem race, totalPrice, CSRF)
2. Remove hardcoded secrets, add timing-safe compare
3. Add zod schemas to all mutating API routes
4. Split `admin/page.tsx` and memoize `ProductCard`
5. Fix `next.config.ts` for production bundle
6. Replace `any` with proper types in admin tabs and API layer
7. Add pagination, rate limits, email verification

## Remediation status (2026-10-29)

- #1 Gift card race condition: fixed with atomic `UPDATE ... WHERE balance >= $amount RETURNING *`.
- #2 Client-controlled totalPrice: fixed; total is now computed server-side from DB prices.
- #3 CSRF subdomain bypass: fixed with strict hostname comparison (`origin.hostname === host`).
- #4 Timing attack on password change: fixed with `crypto.timingSafeEqual`.
- #6/#7 Brute-force on customer login and gift-card redeem: added per-IP/per-email rate limits.
- #15 Reviews POST: added rate limit and Zod validation.
- Hardcoded fallback secrets remain only for dev with production warnings; set `JWT_SECRET` and `CUSTOMER_AUTH_SECRET` in production.
