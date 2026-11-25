# 01 — Product Requirements Document (PRD): RailNova

> **Product Name:** RailNova — *Beyond the Destination*  
> **Version:** 1.0.0  
> **Status:** Active Demonstration & Development  
> **Scope Notice:** All train schedules, fares, PNR records, live corridor telemetry, and payment flows in RailNova are simulated locally for demonstration purposes and are **not** valid for official IRCTC travel.

---

## 1. Purpose & Vision

**RailNova** reimagines Indian railway ticket booking, coach exploration, and live corridor telemetry through an editorial, dark-first web experience. Traditional railway portals suffer from dense, dated UIs, opaque seat layouts, and fragmented post-booking tools. RailNova unifies train discovery, interactive coach berth selection, digital boarding passes, live map telemetry, PNR lookup, and AI-assisted travel guidance into a cohesive, high-craft Next.js application.

### Core Objectives
- **Zero-Friction Setup:** Run out-of-the-box with local JSON persistence (`data/railnova-db.json`) and deterministic fallbacks—requiring zero external database or API keys for local evaluation, while supporting optional PostgreSQL/Supabase, Razorpay Test Mode, RapidAPI/IRCTC feeds, and OpenAI/Gemini enhancement.
- **Spatial & Visual Clarity:** Replace guesswork with interactive coach layouts (`1A`, `2A`, `3A`, `3E`, `SL`, `CC`, `EC`, `2S`) and MapLibre GL corridor tracking.
- **Instant Digital Ticketing:** Deliver perforated digital boarding passes with embedded QR codes (`qrcode`) and downloadable PDF e-tickets (`jspdf`).

---

## 2. Target Personas

| Persona | Primary Goals | Key Touchpoints |
| :--- | :--- | :--- |
| **Daily / Business Commuter** | Fast Vande Bharat & Shatabdi search, window/executive seat selection, instant e-ticket download. | `/trains`, `/book`, `/dashboard` |
| **Long-Distance / Family Traveller** | Berth preference matching (`LB`, `MB`, `UB`, `SL`, `SU`), group passenger management, PNR/RAC tracking. | `/book`, `/pnr`, `/dashboard` |
| **Scenic & Experience Explorer** | Curated railway corridors, route discovery, live speed & station progression telemetry. | `/discover`, `/live-tracking` |
| **Operations / Fleet Admin** | Monitor bookings, cancellations, audit logs, and simulated fleet telemetry. | `/admin` |

---

## 3. Functional Requirements

### 3.1 Train Search & Discovery (`/trains`, `/discover`, `/api/trains`)
- Search trains by origin/destination station code or city, journey date, travel class, and quota (`GN`, `TQ`, `PT`, `LD`, `SS`).
- Display train category (`Vande Bharat`, `Rajdhani`, `Shatabdi`, `Duronto`, `Superfast`, `Mail/Express`), departure/arrival times, duration, distance, running days, pantry/bio-vacuum indicators, and class-wise availability (`AVAILABLE`, `RAC`, `WL`, `NOT_AVAILABLE`).
- Curated scenic corridors and route discovery on `/discover`.
- Optional live provider integration via `src/lib/irctc-provider.ts` (`RAILWAY_API_KEY`, `RAILWAY_API_HOST`) with automatic fallback to `src/lib/railway-data.ts`.

### 3.2 Interactive Coach Visualisation & Booking (`/book`, `/api/bookings`)
- Interactive coach bay & berth selector (`src/components/CoachVisualisation.tsx`) supporting `AVAILABLE`, `OCCUPIED`, `PREFERRED`, and `RAC` states.
- Multi-passenger input form with age, gender, berth preference (`NO_PREF`, `LOWER`, `MIDDLE`, `UPPER`, `SIDE_LOWER`, `SIDE_UPPER`, `WINDOW`), and concession (`NONE`, `SENIOR_CITIZEN`, `STUDENT`, `DIVYANGJAN`).
- Transparent fare breakdown: base fare, taxes, convenience fee, and total amount.
- Simulated payment methods (`UPI`, `CARD`, `NETBANKING`, `WALLET`) with optional Razorpay Test Mode hooks.
- Generates unique 10-digit PNR, booking reference, and `isDemo: true` booking record.

### 3.3 Digital E-Ticket, QR & PDF Export (`src/components/DigitalTicket.tsx`, `/dashboard`)
- Perforated boarding-pass layout with notch styling, monospace PNR/seat metadata, and scannable QR code (`qrcode`).
- Client-side PDF generation (`jspdf`) and print-friendly styles (`@media print`).
- Traveller dashboard (`/dashboard`) to view upcoming/past bookings and submit cancellations (`/api/cancellations`) with refund calculation.

### 3.4 PNR Status Lookup (`/pnr`, `/api/pnr/[pnr]`)
- 10-digit PNR lookup supporting `CONFIRMED`, `RAC`, `WAITLIST`, `CANCELLED`, and `PAYMENT_FAILED` statuses.
- Pre-seeded sample PNRs (`8429104521` for CNF, `6193048271` for RAC) for immediate verification.

### 3.5 Live Corridor Telemetry (`/live-tracking`, `/api/live`)
- Interactive MapLibre GL map (`maplibre-gl`) showing active train coordinates, station stops, halt durations, platform numbers, average speed, and simulated delay/progression telemetry.

### 3.6 Nova AI Travel Assistant (`src/components/NovaAI.tsx`, `/api/assistant`)
- Floating conversational assistant for route suggestions, fare insights, and railway FAQs.
- Runs deterministically out-of-the-box; upgrades to LLM responses when `OPENAI_API_KEY` or `GEMINI_API_KEY` is configured.

### 3.7 Authentication & Admin Operations (`/auth/*`, `/admin`, `/api/auth/*`, `/api/admin`)
- Cookie-based HMAC-SHA256 signed sessions (`railnova_session`, 7-day TTL) with `scrypt` password hashing (`src/lib/auth.ts`).
- Role-based access (`user`, `admin`) with pre-seeded demo accounts (`traveler@railnova.demo`, `admin@railnova.demo`) and demo OTP (`123456`).
- Admin console (`/admin`) for platform metrics, booking oversight, and fleet status.

---

## 4. Non-Functional Requirements

| Category | Requirement |
| :--- | :--- |
| **Performance** | App Router SSR/client split, `tabular-nums` monospace telemetry, smooth 60fps Framer Motion & GSAP transitions. |
| **Accessibility** | Skip-to-content link, `:focus-visible` high-contrast outlines, keyboard-navigable controls, and `prefers-reduced-motion` compliance. |
| **Security** | Zod schema validation on API inputs, `crypto.timingSafeEqual` for password & token verification, in-memory rate limiting (`src/lib/rate-limit.ts`), no hardcoded production secrets. |
| **Persistence** | Queued, atomic-style JSON writes (`writeQueue` + `memoryCache` in `src/lib/db.ts`) with clean path to PostgreSQL/Supabase. |
| **Quality Gates** | `npm run typecheck`, `npm run lint`, and `npm run build` must pass with zero errors before release. |

---

## 5. Success Metrics (Demonstration & Engineering)
- **End-to-End Booking Completion:** Users can search a train, pick a berth, book a ticket, and export a PDF/QR pass in under 60 seconds.
- **Zero-Config Boot:** `npm install && npm run dev` serves all routes and seeded data without external dependencies.
- **Theme & Motion Parity:** Full visual parity across Obsidian Dark (`#0C0D10`) and Warm Ivory Light (`#F5F2EA`) modes.
