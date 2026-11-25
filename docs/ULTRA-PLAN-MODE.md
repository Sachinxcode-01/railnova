# 03 — Ultra Plan Mode: Deep Analysis & Pre-Coding Protocol

Use this prompt/protocol before implementing any non-trivial feature, refactor, or bug fix in **RailNova**. It forces thorough codebase reconnaissance, architectural trade-off analysis, and a verifiable step-by-step plan before a single line of code is edited.

---

## How to Invoke

Paste or reference this document at the start of a complex task:

> *"Follow `docs/ULTRA-PLAN-MODE.md` to analyze the codebase and produce a complete implementation plan before writing any code."*

---

## Phase 1: Scoped Reconnaissance (Read-Only)

Before proposing changes, inspect the exact files involved:
1. **Data & Types:** Check `src/lib/types.ts` for existing interfaces (`Train`, `BookingRecord`, `CoachBerth`, `UserProfile`, etc.).
2. **Backend & Persistence:** Inspect relevant handlers in `src/app/api/**` and persistence/auth helpers in `src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/rate-limit.ts`, and `src/lib/irctc-provider.ts`.
3. **Frontend & Components:** Inspect the target route in `src/app/**/page.tsx` and related UI components in `src/components/**`.
4. **Styling & Tokens:** Check `src/app/globals.css` and `src/app/layout.tsx` to ensure theme, font, and motion conventions are respected.

*Rule: Never assume a file's contents or symbol names from memory—verify them directly.*

---

## Phase 2: Problem Framing & Edge-Case Audit

Answer these five questions explicitly in your plan:
1. **Root Cause / Core Goal:** What exact user or system problem are we solving?
2. **Blast Radius:** Which pages, API routes, types, and seeded data (`data/railnova-db.json`) could be affected?
3. **Failure Modes & Edge Cases:**
   - What happens on invalid Zod input, expired/missing `railnova_session`, or rate-limit exhaustion?
   - What happens in both Dark (`#0C0D10`) and Light (`#F5F2EA`) themes?
   - What happens on mobile viewports and under `prefers-reduced-motion`?
   - What happens if optional env vars (`RAILWAY_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `DATABASE_URL`) are unset?
4. **Alternative Approaches:** Compare at least 2 implementation options (e.g., client-side state vs. server action/API route, extending an existing component vs. adding a new one) and justify the simplest, cleanest choice.
5. **Security & Data Integrity:** Confirm no secrets are exposed to client bundles and `writeQueue` in `src/lib/db.ts` is preserved.

---

## Phase 3: Step-by-Step Implementation Plan

Produce a concise, ordered checklist:
- **Step 1 — Types & Validation:** Exact changes to `src/lib/types.ts` or Zod schemas.
- **Step 2 — Backend / Data Layer:** Exact API route or `src/lib/*` updates.
- **Step 3 — UI & Motion:** Exact component/page updates using existing design tokens and components.
- **Step 4 — Verification Plan:**
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build` (for route/bundle changes)
  - Manual or automated flow verification (e.g., `/trains` → `/book` → `/dashboard` → `/pnr`).

---

## Phase 4: Approval Gate

Stop after presenting the plan and wait for confirmation (unless the user explicitly authorized immediate execution). Once approved, execute cleanly, keep diffs minimal, and report only verified command outputs.
