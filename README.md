<div align="center">

![RailNova — Beyond the Destination](./public/railnova-banner.png)

# RailNova — Beyond the Destination

**Next-Generation Indian Railway Ticket Booking, Coach Visualisation & Live Corridor Telemetry**

[![Next.js](https://img.shields.io/badge/Next.js-16-0C0D10?style=for-the-badge&logo=next.js&logoColor=D4FF3F)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-0C0D10?style=for-the-badge&logo=react&logoColor=D4FF3F)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-0C0D10?style=for-the-badge&logo=typescript&logoColor=D4FF3F)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-0C0D10?style=for-the-badge&logo=tailwindcss&logoColor=D4FF3F)](https://tailwindcss.com/)

</div>

---

> **Demonstration Notice:** All train schedules, fares, PNR records, live corridor telemetry, and payment flows in RailNova are simulated locally for demonstration purposes and are **not** valid for official IRCTC travel.

---

## Table of Contents

- [Overview](#overview)
- [Landing Experience](#landing-experience)
- [Key Features](#key-features)
- [Design System & Color Palette](#design-system--color-palette)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Accounts & Sample PNRs](#demo-accounts--sample-pnrs)
- [API Endpoints](#api-endpoints)
- [Verification & Scripts](#verification--scripts)

---

## Overview

**RailNova** reimagines the Indian railway booking and journey discovery experience with an editorial, dark-first interface, fluid motion choreography, interactive coach seat layouts, real-time corridor tracking, and instant digital e-tickets with QR verification and PDF export.

Built on **Next.js 16 (App Router + Turbopack)**, **React 19**, and **TypeScript**, the platform runs out-of-the-box with local JSON persistence (`data/railnova-db.json`) and zero external database setup required—while providing optional hooks for PostgreSQL/Supabase, RailKit live feeds, Razorpay Test Mode, and OpenRouter/Gemini-powered intelligence.

---

## Landing Experience

The home page (`/`) pairs a GSAP-choreographed hero and `SmartBookingPanel` with nine interactive, reduced-motion-aware landing sections in `src/components/landing/`:

| Section | Component | Interaction & Motion |
| :--- | :--- | :--- |
| **Problem & Solution** | `StorytellingSection` | Scroll-driven progress rail (`useScroll` / `useTransform`) with manual chapter lock & resume sync |
| **Platform Features** | `FeaturesBentoSection` | 12-column interactive bento grid with live berth, quota (`GN`/`TQ`/`PT`/`LD`/`SS`), telemetry & trilingual previews |
| **How It Works** | `RailwayTimelineSection` | Animated 4-station horizontal track with gliding `RN-EXP` train marker and animated action strip |
| **Product Showcase** | `ProductShowcaseSection` | Keyboard-accessible WAI-ARIA tabbed sandbox for Coach Selector, Corridor & Fares, and PNR Inspector |
| **Railway Map** | `RouteNetworkSection` | Animated SVG Indian rail topology built from `STATION_MAP` coordinates with pulse paths & corridor selectors |
| **Destinations** | `DestinationsSection` | Luxury travel photography across 12 Indian hubs with animated mood filters (`Editorial`, `Coasts & Hills`, `Royal & Sacred`, `Metro`) |
| **Nova AI** | `NovaAIDemoSection` | Embedded interactive chat demo (`role="log"`, smart auto-scroll, `EN`/`HI`/`KN`, animated typing dots) |
| **Digital Tickets** | `DigitalTicketSection` | Thermal printer slot with sweep beam + replayable Champagne Ivory QR boarding-pass feed animation |
| **Security** | `SecuritySection` | Minimal 4-pillar trust layout covering HMAC cookies, Zod validation, security headers/rate limits, and demo isolation |

---

## Key Features

- **Train Search & Journey Discovery (`/trains`, `/discover`)**
  Search across Vande Bharat, Rajdhani, Shatabdi, Duronto, Superfast, and Mail/Express corridors with class-wise availability, flexible dates, and curated route discovery.
- **Interactive Coach Visualisation (`/book`)**
  Inspect coach bays and berth configurations (`1A`, `2A`, `3A`, `3E`, `CC`, `EC`, `SL`, `2S`) with interactive seat selection, preference matching, and accessible berth markers.
- **Smart Booking & Digital E-Tickets (`/book`, `/thank-you`, `/dashboard`)**
  Generate perforated Champagne Ivory boarding passes with embedded **QR codes** (`qrcode`) and downloadable **PDF tickets** (`jspdf`), plus instant cancellation and refund tracking.
- **Live Corridor Telemetry (`/live-tracking`)**
  Interactive train tracking with station progression, halt durations, platform numbers, speed telemetry, and MapLibre GL support.
- **PNR Status Lookup (`/pnr`)**
  10-digit PNR verification supporting Confirmed (`CNF`), Reservation Against Cancellation (`RAC`), and Waitlist (`WL`) status views.
- **Nova AI Travel Assistant**
  Floating concierge (`NovaAI`) and embedded landing demo providing route guidance, fare insights, and RAC/Waitlist explanations in English, Hindi, and Kannada—running deterministically out-of-the-box or enhanced via `OPENROUTER_API_KEY` / `GEMINI_API_KEY`.
- **Traveller Dashboard & Admin Console (`/dashboard`, `/admin`)**
  Manage upcoming bookings, cancellations, data export, and sessions as a traveller, or oversee fleet operations, chart status, backups, and audit logs from `/admin`.
- **Dual Theme & Motion Craft**
  Obsidian dark mode (`#0C0D10`) and Champagne Ivory light mode (`#F5F2EA`) with **Space Grotesk**, **Manrope**, and **JetBrains Mono** typography, **Framer Motion**, **GSAP**, and `prefers-reduced-motion` support.

---

## Design System & Color Palette

| Token | Dark Mode | Light Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#0C0D10` | `#F5F2EA` | Primary canvas background |
| `--bg-surface` | `#17191F` | `#FFFFFF` | Cards, panels & navigation |
| `--bg-surface-elevated` | `#1E2129` | `#EFECE3` | Elevated modals & interactive surfaces |
| `--accent-primary` | `#D4FF3F` | `#466800` | Primary CTAs, rail highlights & active states |
| `--accent-lavender` | `#B8A7FF` | `#E5DFFF` | Secondary atmospheric accents & badges |
| `--text-primary` | `#F8F9FC` | `#15171B` | Headings & primary body copy |
| `--text-secondary` | `#A3A8B8` | `#4F5360` | Metadata, labels & supporting text |

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack), React 19, TypeScript 6 |
| **Styling & UI** | Tailwind CSS v4, Lucide React |
| **Motion & Maps** | Framer Motion, GSAP, MapLibre GL |
| **Tickets & Validation** | `jspdf`, `qrcode`, `zod` |
| **Persistence** | Local JSON store (`data/railnova-db.json`), optional Supabase / PostgreSQL |

---

## Project Structure

```text
Railway-Ticket-Bookings/
├── data/
│   └── railnova-db.json           # Local JSON persistence store
├── docs/                          # Product, UI/UX, and planning specs (PRD, design, ULTRA-PLAN-MODE)
├── public/
│   └── railnova-banner.png        # 16:9 project README banner
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin operations console
│   │   ├── api/                   # REST API routes (auth, trains, bookings, pnr, live, assistant, analytics, admin)
│   │   ├── auth/                  # Sign-in & registration pages
│   │   ├── book/                  # Seat selection & ticket booking flow
│   │   ├── contact/               # Support & contact desk
│   │   ├── dashboard/             # Traveller bookings & cancellations
│   │   ├── discover/              # Curated railway routes & experiences
│   │   ├── licenses/              # Open-source licences page
│   │   ├── live-tracking/         # Live corridor map & telemetry
│   │   ├── pnr/                   # PNR status lookup
│   │   ├── privacy/               # Privacy & security policy
│   │   ├── terms/                 # Terms of service
│   │   ├── thank-you/             # Booking confirmation & pass view
│   │   ├── trains/                # Train search & availability
│   │   ├── globals.css            # Design tokens & theme variables
│   │   ├── layout.tsx             # Root layout, fonts & global providers
│   │   └── page.tsx               # Hero + 9-section interactive landing page
│   ├── components/
│   │   ├── landing/               # 9 modular landing page sections
│   │   └── ...                    # CoachVisualisation, DigitalTicket, NovaAI, SmartBookingPanel, Navbar, Footer
│   └── lib/                       # Auth helpers, DB layer, rate limiter, railway seed data & types
├── .env.example                   # Environment variable template
├── next.config.ts                 # Next.js configuration & security headers
├── package.json                   # Scripts & dependencies
└── tsconfig.json                  # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** `20+` recommended
- **npm** `9+`

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sachinxcode-01/railnova.git
   cd railnova
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Open `.env.local` and set `RAILNOVA_SESSION_SECRET` to a strong random string (at least 32 characters).

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open the application**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `RAILNOVA_SESSION_SECRET` | Yes | 32+ character secret used to sign `HttpOnly` session tokens |
| `RAILKIT_API_KEY` | No | Optional RailKit key for live Indian Railways feeds |
| `RAILWAY_API_KEY` | No | Optional fallback railway provider API key |
| `RAILWAY_API_HOST` | No | Optional fallback railway provider API host |
| `NEXT_PUBLIC_APP_URL` | No | Public base URL (defaults to `http://localhost:3000`) |
| `NEXT_PUBLIC_GA_ID` | No | Optional Google Analytics 4 measurement ID |
| `DATABASE_URL` | No | Optional PostgreSQL connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Optional Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Optional Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Optional Supabase service role key |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | No | Optional Razorpay test/live mode key ID |
| `RAZORPAY_KEY_SECRET` | No | Optional Razorpay test/live mode secret |
| `OPENROUTER_API_KEY` | No | Optional OpenRouter key for Nova AI |
| `GEMINI_API_KEY` | No | Optional Gemini key for Nova AI |

---

## Demo Accounts & Sample PNRs

Use the pre-seeded traveller account to explore booking, PNR, and cancellation flows immediately:

- **Traveller Account:** `traveler@railnova.demo` / `Travel@RailNova2026`
- **Admin Console (`/admin`):** Restricted to locally seeded administrator credentials
- **Demo Mobile OTP:** `123456`
- **Sample PNRs:**
  - `8429104521` — **Confirmed (`CNF`)**
  - `6193048271` — **Reservation Against Cancellation (`RAC`)**

---

## API Endpoints

| Endpoint | Purpose |
| :--- | :--- |
| `GET /api/trains` | Search trains, routes, classes, and seat availability |
| `GET, POST /api/bookings` | List user bookings or create a new ticket reservation |
| `POST /api/cancellations` | Cancel an existing booking and compute refund |
| `GET /api/pnr/[pnr]` | Retrieve live status for a 10-digit PNR number |
| `GET /api/live` | Fetch simulated live corridor telemetry |
| `POST /api/assistant` | Query the Nova AI railway assistant |
| `POST /api/analytics` | Record privacy-respecting product analytics events |
| `GET, POST /api/admin` | Admin metrics, chart toggling, and backup operations |
| `GET, POST /api/auth/*` | Session authentication (`login`, `register`, `logout`, `me`, `me/export`) |

---

## Verification & Scripts

Run TypeScript verification and the Next.js production build before deploying:

```bash
npm run typecheck
npm run build
```

Additional scripts defined in `package.json`:

```bash
npm run start   # Start production server after build
npm run backup  # Run scripts/backup-db.mjs database backup
npm run lint    # Runs `next lint` (requires an eslint.config.* file in Next.js 16)
```
