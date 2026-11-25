# RailNova — Beyond the Destination

A next-generation Indian railway ticket booking and journey discovery demonstration platform built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, and GSAP.

> **Demonstration Notice:** Schedules, fares, PNR records, live corridor telemetry, and payments are simulated locally for demonstration and are **not** valid for official IRCTC travel.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set `RAILNOVA_SESSION_SECRET`.
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

## Demo Accounts & Sample PNRs

- **Traveller:** `traveler@railnova.demo` / `Travel@RailNova2026`
- **Admin:** `admin@railnova.demo` / `Admin@RailNova2026`
- **Demo Mobile OTP:** `123456`
- **Sample PNRs:** `8429104521` (Confirmed), `6193048271` (RAC)

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```
