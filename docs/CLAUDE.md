# 02 — CLAUDE.md: Project Instructions & Coding Standards

This document provides authoritative instructions for AI coding assistants working in **RailNova** (`Railway-Ticket-Bookings`). Follow these conventions strictly on every task.

---

## 1. Project Identity & Tech Stack

- **App Name:** RailNova — *Beyond the Destination*
- **Framework:** Next.js 15 (App Router, `src/app/`), React 19, TypeScript (`strict: true`)
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss";` in `src/app/globals.css`) + CSS custom properties (`--bg-primary`, `--accent-primary`, etc.)
- **Icons & Motion:** `lucide-react`, `framer-motion`, `gsap`
- **Maps & Media:** `maplibre-gl` (live tracking), `qrcode` & `jspdf` (digital tickets)
- **Validation:** `zod` for all API request/response boundaries
- **Persistence:** Local JSON store (`data/railnova-db.json`) managed via `src/lib/db.ts`

---

## 2. Repository Map

```text
src/
├── app/
│   ├── admin/           # Admin operations console
│   ├── api/             # Route Handlers (admin, assistant, auth, bookings, cancellations, live, pnr, trains)
│   ├── auth/            # signin & register pages
│   ├── book/            # Seat selection & booking flow
│   ├── dashboard/       # Traveller bookings & cancellations
│   ├── discover/        # Curated corridors & experiences
│   ├── live-tracking/   # MapLibre GL live corridor telemetry
│   ├── pnr/             # 10-digit PNR lookup
│   ├── trains/          # Train search & availability
│   ├── globals.css      # Design tokens, dark/light themes, print & reduced-motion rules
│   └── layout.tsx       # RootLayout, Google Fonts (Space Grotesk, Manrope, JetBrains Mono), global providers
├── components/          # Shared UI (CoachVisualisation, DigitalTicket, NovaAI, SmartBookingPanel, Navbar, Footer, etc.)
└── lib/                 # Core logic (auth.ts, db.ts, irctc-provider.ts, railway-data.ts, rate-limit.ts, types.ts)
```

---

## 3. Coding Standards & Conventions

1. **TypeScript Strictness**
   - `tsconfig.json` has `"strict": true`. Never introduce `any` or `@ts-ignore` unless strictly necessary and documented.
   - Reuse domain types from `src/lib/types.ts` (`Train`, `BookingRecord`, `CoachBerth`, `PassengerInput`, `UserProfile`, etc.).
   - Use `@/*` path aliases (`./src/*`) for all internal imports.

2. **Next.js App Router & React 19**
   - Default to Server Components; add `'use client'` only when hooks, browser APIs, Framer Motion, GSAP, or MapLibre GL are required.
   - Never import server-only modules (`fs/promises`, `crypto`, `src/lib/db.ts`, `src/lib/auth.ts`) into Client Components.

3. **API Routes (`src/app/api/**`)**
   - Validate all incoming payloads and query parameters with `zod`.
   - Enforce rate limiting via `checkRateLimit()` from `src/lib/rate-limit.ts` on public/mutation endpoints.
   - Authenticate protected routes using session helpers in `src/lib/auth.ts` (`railnova_session` cookie).
   - Return structured JSON with appropriate HTTP status codes (`400`, `401`, `403`, `404`, `429`, `500`).

4. **Database & Persistence (`src/lib/db.ts`)**
   - Always read/write through `src/lib/db.ts` helpers so `memoryCache` and `writeQueue` stay synchronized. Never write directly to `data/railnova-db.json` from route handlers.
   - Preserve `isDemo: true` on demonstration booking records.

5. **Security & Secrets**
   - Never commit `.env.local` or hardcode API keys/production secrets.
   - Use `crypto.timingSafeEqual` for all secret/password/HMAC comparisons.
   - Never bypass authentication, rate limits, or role checks (`role === 'admin'`).

6. **Styling & Accessibility**
   - Always use CSS variables (`var(--bg-primary)`, `var(--bg-surface)`, `var(--accent-primary)`, `var(--text-primary)`, etc.) rather than hardcoded hex colors so both Dark (`[data-theme="dark"]`) and Light (`[data-theme="light"]`) modes work seamlessly.
   - Use `.font-display` for headings, `.font-sans` for body, and `.font-mono-tech` (`tabular-nums`) for PNRs, train numbers, fares, and timestamps.
   - Respect `prefers-reduced-motion` and keep `:focus-visible` outlines intact.

---

## 4. Required Verification Commands

After any code change, run and confirm all relevant checks pass:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run build       # next build (when routes, layouts, or server/client boundaries change)
```

---

## 5. Do-Not-Break Rules

- **Demo Disclaimer:** Keep demonstration notices clear—tickets and PNRs are simulated and not valid for official IRCTC travel.
- **Seed Compatibility:** Do not break pre-seeded demo accounts (`traveler@railnova.demo`, `admin@railnova.demo`) or sample PNRs (`8429104521`, `6193048271`).
- **Minimal Diffs:** Prefer editing existing shared helpers and components over creating duplicate utilities.
