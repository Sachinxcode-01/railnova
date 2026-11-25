# 04 — Full UI/UX Prompt & Design System Specification: RailNova

Use this specification whenever designing, building, or polishing UI in **RailNova** to guarantee visual consistency, editorial craft, responsive ergonomics, and accessible motion.

---

## 1. Aesthetic Direction & Brand Mood

- **Theme:** *Editorial Dark-First Railway Precision* — high-contrast obsidian surfaces paired with electric chartreuse-lime highlights, atmospheric lavender accents, and crisp monospaced telemetry.
- **Tone:** Confident, spatial, tactile (like a modern boarding pass meets a high-speed rail cockpit). Avoid generic SaaS templates, cluttered tables, or harsh unstyled borders.

---

## 2. Color Tokens (`src/app/globals.css`)

Always reference CSS custom properties rather than raw hex values so dual-theme switching (`ThemeProvider`) works automatically:

| Token | Dark Mode (`[data-theme="dark"]`) | Light Mode (`[data-theme="light"]`) | Intended Usage |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#0C0D10` | `#F5F2EA` | Primary page canvas |
| `--bg-surface` | `#17191F` | `#FFFFFF` | Cards, panels, navbar, ticket body |
| `--bg-surface-elevated` | `#1E2129` | `#EFECE3` | Modals, dropdowns, hover states |
| `--accent-primary` | `#D4FF3F` | `#527A00` | Primary CTAs, active tabs, selected berths |
| `--accent-on-primary` | `#0C0D10` | `#FFFFFF` | Text/icons placed on `--accent-primary` |
| `--accent-lavender` | `#B8A7FF` | `#E5DFFF` | Secondary badges, atmospheric highlights |
| `--text-primary` | `#F8F9FC` | `#15171B` | Headings and primary copy |
| `--text-secondary` | `#9296A3` | `#626672` | Captions, metadata, labels |
| `--border-subtle` | `#2A2D35` | `#E4E1D9` | Hairline dividers and card outlines |
| `--success` | `#34D399` | `#059669` | `CNF` / Available / Paid states |
| `--warning` | `#FBBF24` | `#D97706` | `RAC` / Delay warnings |
| `--error` | `#FB7185` | `#E11D48` | `WL` / Cancelled / Error states |

### Atmospheric Gradients & Textures
- `--gradient-accent`: `linear-gradient(135deg, #D4FF3F 0%, #8EF0A7 100%)`
- `--gradient-atmospheric`: `linear-gradient(135deg, #17191F 0%, #302747 50%, #0C0D10 100%)`
- `--gradient-lavender`: `linear-gradient(135deg, #B8A7FF 0%, #E3C9FF 100%)`
- Subtle dot-grain overlay via `.grain-overlay`.

---

## 3. Typography (`src/app/layout.tsx`)

| Role | Font Family | CSS Variable / Utility | Usage Rules |
| :--- | :--- | :--- | :--- |
| **Display** | Space Grotesk (`500`, `600`, `700`) | `--font-display` / `.font-display` | Page titles, hero headlines, train names, section headers |
| **Body** | Manrope (`400`, `500`, `600`, `700`) | `--font-sans` | Descriptions, form labels, navigation, Nova AI chat |
| **Telemetry** | JetBrains Mono (`400`, `500`, `600`) | `--font-mono` / `.font-mono-tech` | Train numbers, station codes (`NDLS`, `MMCT`), PNR digits, fares (`₹`), times, speeds (`km/h`) with `tabular-nums` |

---

## 4. Layout, Components & Spatial Craft

- **Navigation (`Navbar`, `RailTransitionBar`):** Sticky top bar with clean route links (`/trains`, `/discover`, `/live-tracking`, `/pnr`, `/dashboard`, `/admin`), theme toggle, and auth state.
- **Digital Boarding Pass (`DigitalTicket`):**
  - Use `.ticket-notch-left` and `.ticket-notch-right` with a dashed horizontal tear line separating journey summary from passenger/QR details.
  - Ensure `@media print` hides `.no-print` chrome and renders a crisp white printable pass.
- **Coach Visualisation (`CoachVisualisation`):**
  - Clear bay grouping (`LB`, `MB`, `UB`, `SL`, `SU`, `WS`, `MS`, `AS`) with distinct visual states for `AVAILABLE`, `OCCUPIED`, `PREFERRED`, `RAC`, and user-selected seats.
  - Provide an accessible legend and keyboard-selectable seat buttons.
- **Live Corridor Map (`MapLibre GL` on `/live-tracking`):**
  - Pair the interactive map with a scannable station-stop timeline showing arrival/departure, halt minutes, distance (`km`), and platform numbers.
- **Floating Assistant (`NovaAI`):**
  - Non-intrusive floating launcher that expands into a clean chat drawer without obstructing booking CTAs on mobile.

---

## 5. Motion & Micro-Interactions

- **Framer Motion & GSAP:** Use purposeful, rail-inspired easing (smooth acceleration/deceleration) for page entrances, route transitions (`RailTransitionBar`), and card reveals.
- **Reduced Motion:** Never override the global `@media (prefers-reduced-motion: reduce)` rule in `src/app/globals.css`. Keep critical information readable without relying on animation.
- **Interactive Feedback:** Every clickable card, berth, and button must have clear `:hover` and `:focus-visible` states (`2px solid var(--accent-primary)`).

---

## 6. UI/UX Checklist Before Shipping Any Screen

1. Verified in **both** Dark Mode and Light Mode with sufficient contrast.
2. Tested on **mobile** (`375px`), **tablet** (`768px`), and **desktop** (`1280px+`) with zero horizontal overflow (`overflow-x: hidden` safe).
3. All numeric telemetry (PNRs, fares, times, seat counts) uses `.font-mono-tech` (`tabular-nums`).
4. Loading, empty, and error states are explicitly designed and helpful.
5. Keyboard navigation (`Tab`, `Enter`, `Escape`) works cleanly across forms, coach seats, and modals.
