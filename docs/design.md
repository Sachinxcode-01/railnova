# RailNova Design System & Visual Architecture

**RailNova — Beyond the Destination** uses an editorial dark-first design system paired with warm ivory contrast sections, high-contrast typography, and subtle railway-inspired motion.

---

## 1. Color Tokens

Theme tokens are defined as CSS custom properties in [`src/app/globals.css`](../src/app/globals.css) and switched via `data-theme="dark"` (default) or `data-theme="light"` managed by [`ThemeProvider`](../src/components/ThemeProvider.tsx) (persisted in `localStorage` under `railnova-theme`).

### Dark Theme (`:root`, default)

| Token | Value | Role |
| :--- | :--- | :--- |
| `--bg-primary` | `#0C0D10` | Primary obsidian canvas |
| `--bg-surface` | `#17191F` | Cards, panels, and navbar surface |
| `--bg-surface-elevated` | `#1E2129` | Elevated interactive surfaces |
| `--accent-primary` | `#D4FF3F` | Signal lime primary action & highlight |
| `--accent-on-primary` | `#0C0D10` | Text/icons on `--accent-primary` |
| `--accent-lavender` | `#B8A7FF` | Secondary lavender accent |
| `--ivory` | `#F5F2EA` | Warm editorial contrast surface |
| `--text-primary` | `#F8F9FC` | Primary headings and body copy |
| `--text-secondary` | `#A3A8B8` | Muted labels and supporting copy |
| `--border-subtle` | `#2A2D35` | Hairline borders and dividers |
| `--success` | `#34D399` | Confirmed / on-time status |
| `--warning` | `#FBBF24` | RAC / caution status |
| `--error` | `#FB7185` | Validation errors & alerts |

### Light Theme (`[data-theme="light"]`)

| Token | Value | Role |
| :--- | :--- | :--- |
| `--bg-primary` | `#F5F2EA` | Warm ivory canvas |
| `--bg-surface` | `#FFFFFF` | Crisp card surface |
| `--bg-surface-elevated` | `#EFECE3` | Subtle elevated surface |
| `--accent-primary` | `#466800` | High-contrast olive-lime primary accent |
| `--accent-on-primary` | `#FFFFFF` | Text/icons on `--accent-primary` |
| `--accent-lavender` | `#E5DFFF` | Soft lavender surface accent |
| `--text-primary` | `#15171B` | Primary ink |
| `--text-secondary` | `#4F5360` | Muted ink |
| `--border-subtle` | `#E4E1D9` | Warm hairline border |
| `--success` | `#059669` | Confirmed / on-time status |
| `--warning` | `#D97706` | RAC / caution status |
| `--error` | `#E11D48` | Validation errors & alerts |

### Gradients & Textures
- `--gradient-accent`: `linear-gradient(135deg, #D4FF3F 0%, #8EF0A7 100%)`
- `--gradient-atmospheric`: `linear-gradient(135deg, #17191F 0%, #302747 50%, #0C0D10 100%)`
- `--gradient-lavender`: `linear-gradient(135deg, #B8A7FF 0%, #E3C9FF 100%)`
- `.grain-overlay`: Subtle `24px × 24px` radial dot matrix texture.
- `.ticket-notch-left` / `.ticket-notch-right`: `12px` radial cutouts for boarding pass / ticket edges.

---

## 2. Typography

Three Google Fonts are loaded via `next/font/google` in [`src/app/layout.tsx`](../src/app/layout.tsx):

| Role | Font Family | CSS Variable | Weights | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `Space Grotesk` | `--font-display` | `500`, `600`, `700` | `h1`–`h4`, hero headlines, `.font-display` |
| **Body / UI** | `Manrope` | `--font-sans` | `400`, `500`, `600`, `700` | Default `body` copy, forms, buttons |
| **Technical / Mono** | `JetBrains Mono` | `--font-mono` | `400`, `500`, `600` | `.font-mono-tech` (`tabular-nums`) for PNRs, train numbers, fares, timestamps |

---

## 3. Brand Identity & Assets

- **Logo (`RailNovaLogo`)**: Defined in [`src/components/Navbar.tsx`](../src/components/Navbar.tsx) — a `28×28` rounded-square emblem (`rx="6"`) with an angled `#D4FF3F` rail prism and horizontal track line, paired with `RailNova` wordmark (`Nova` in `--accent-primary`).
- **Favicon**: [`src/app/icon.svg`](../src/app/icon.svg) mirrors the brand mark on `#0C0D10`.
- **Social Preview (OG / Twitter)**: [`src/app/opengraph-image.tsx`](../src/app/opengraph-image.tsx) and [`src/app/twitter-image.tsx`](../src/app/twitter-image.tsx) render a `1200×630` edge `ImageResponse` card with the RailNova wordmark and gradient backdrop.
- **Photography**: Curated Unsplash imagery rendered via Next.js `<Image>` (`image/avif` and `image/webp` enabled in [`next.config.ts`](../next.config.ts)) with responsive `sizes` and descriptive `alt` text.

---

## 4. Layout, Navigation & Component Patterns

- **Container**: Centered `max-w-[1360px]` with responsive horizontal padding (`px-4 sm:px-6 lg:px-8`).
- **Navigation ([`Navbar.tsx`](../src/components/Navbar.tsx))**: Fixed `h-16` header with transparent-to-blurred transition on scroll, active route rail indicator (`layoutId="nav-active-rail"`), dark/light theme toggle, and full-screen mobile drawer (`lg:hidden`).
- **Hero & Editorial Rhythm ([`page.tsx`](../src/app/page.tsx))**:
  1. Full-bleed dark obsidian hero (`min-h-[94vh]`) with perspective SVG track lines, GSAP staggered entrance (`.hero-stagger`), and embedded `SmartBookingPanel`.
  2. Warm ivory (`#F5F2EA`) contrast section for Signature Corridors.
  3. Asymmetric 12-column Bento grid for Curated Arrivals (12 Indian destinations) and platform capabilities.
- **Interactive Overlays**:
  - `NovaAI` floating assistant drawer.
  - [`CookieBanner`](../src/components/CookieBanner.tsx) bottom-left consent dialog (`railnova_cookie_consent`) gating [`Analytics`](../src/components/Analytics.tsx).
- **Utility & Legal Views**: Custom [`not-found.tsx`](../src/app/not-found.tsx) (404), [`error.tsx`](../src/app/error.tsx), [`privacy/page.tsx`](../src/app/privacy/page.tsx), and [`terms/page.tsx`](../src/app/terms/page.tsx).

---

## 5. Accessibility, Motion & Print

- **Keyboard & Focus**: Global `:focus-visible` outline (`2px solid var(--accent-primary)`, `outline-offset: 2px`) and a "Skip to main content" link (`#main-content`) in [`layout.tsx`](../src/app/layout.tsx).
- **Reduced Motion**: `@media (prefers-reduced-motion: reduce)` in [`globals.css`](../src/app/globals.css) disables CSS transitions/animations, and GSAP hero animations short-circuit when reduced motion is preferred.
- **Print Support**: `@media print` hides `.no-print` chrome (navbar, footer, cookie banner) and forces a `#FFFFFF` background with `#0C0D10` text for boarding passes.
