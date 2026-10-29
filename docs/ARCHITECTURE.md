# Architecture — Podnebesnaya

Last updated: 2026-10-29

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Runtime | Next.js 16 (App Router) | Vercel deploy, React 19, TS 5.8 |
| Database | Neon PostgreSQL | Prisma 7 ORM, pg driver |
| State | Zustand 5 (persist) | useCartStore, useWishlistStore, useOrderStore, useCatalogStore, usePromoStore |
| Forms | react-hook-form + zod 4 | Schema validation on client, weak on server |
| UI | Tailwind 4, Framer Motion 12, lucide-react | 65 files with `'use client'` |
| Auth | JWT (jose) via HttpOnly cookie | Separate admin + customer auth |
| Rate limit | @upstash/ratelimit + Redis (in-memory fallback) | 60 req/min global on /api |

## Data model

```
Product  (id, name, price, stock, images JSON, notes JSON, offer?, originalPrice?, discountPercent?)
Order    (id, customerName, customerEmail, customerAddress, items JSON, totalPrice, status, trackingNumber?, phone?, contactMethod?)
Customer (id, email @unique, password, name?)
Review   (id @cuid, productId, authorName, rating, text)
GiftCard (code @id, initialAmount, balance)
AdminSetting (key @id, value)   ← lazy-created, no seed
```

## Request flow

```
Client
  → Next.js middleware (rate limit + admin guard + CSRF origin check)
    → API route (zod? inconsistent)
      → Prisma client
        → Neon PostgreSQL
```

## Key directories

```
app/
  api/            ← 20+ route handlers
  admin/          ← protected admin SPA
  product/[id]/   ← PDP, server component with params Promise
components/
  admin/          ← CatalogTab, BannersTab, CollectionsTab, SettingsTab
  CartDrawer.tsx  ← 5-store subscriber
  ProductCard.tsx ← list item, no memo
store/            ← Zustand stores with persist
lib/
  auth.ts         ← JWT admin auth (hardcoded fallback secret!)
  customerAuth.ts ← JWT customer auth
  rateLimit.ts    ← in-memory + Upstash Redis
prisma/
  schema.prisma   ← 6 models
  seed.ts         ← MISSING (db:seed script broken)
```

## Deployment

- Host: Vercel
- DB: Neon PostgreSQL (project: neondb)
- Env: Vercel env vars + local `.env` (gitignored)
- Admin password: stored in data/admin-password.txt (local seed only; serverless cannot write files)
- Git: https://github.com/GinToks/Podnebesnaya

## Known constraints

- Serverless runtime: no filesystem writes; seed must run locally or via Neon console
- `next.config.ts`: missing `output:'standalone'`, `compress`, `experimental.optimizePackageImports`
- Bundle initial >500 KB (Framer Motion 228 KB chunk, React 163 KB)
- Memory rateLimiter grows to 10k keys before cleanup — not suitable for high traffic

## Open questions

- [ ] `cacheComponents` opt-in for Next.js 16?
- [ ] Migrate from in-memory rateLimiter to Upstash Redis only?
- [ ] Replace JSON columns (`images`, `notes`, `offer`) with typed relations?
- [ ] Add `output:'standalone'` for Docker/self-host option?
