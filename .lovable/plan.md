# KICKOFF — Full Brand + Site + Dashboard Build Plan

## Heads-up before we start
- **`/public/frames/` is empty** — no `ezgif-frame-*.jpg` files are in the repo. The `ScrollytellingCanvas` component will be built exactly per spec (auto-detects frame count via a manifest fetch), but until frames are dropped in it will show the black background + LOADING state. I'll add a small `frames-manifest.json` fetch so you can drop frames in later without code changes. If you have the frame zip, upload it and I'll wire it up in the same build.
- The attached `KICKOFF_BUILD_GUIDE.md` is a **backend/P2P integration spec** (Pears/QVAC/WDK). There is no separate PROJECT.md with landing copy, so I'll derive all voice/copy/features/CTAs from that guide (product = P2P football intelligence for World Cup 2026; three pillars: local AI, P2P rooms, self-custodial USDt tipping/pools).

## 1. Brand system
- **Wordmark**: "KICKOFF" set in Instrument Serif, tight tracking, with a small monospace `//` prefix mark for merch use.
- **Logo mark**: geometric "K" built from a football pentagon + motion slash — single-color, works on hoodies/caps/stickers. Two lockups: horizontal (mark + wordmark) and stacked (mark over wordmark). Delivered as SVG components in `src/components/brand/` (`Logomark.tsx`, `Wordmark.tsx`, `LogoLockup.tsx`) so they're crisp at any size and reusable for merch exports.
- **Palette**: pure `#000` bg, `#fff` text, `#A0A0A0` muted, `white/10` borders. Single accent `#C6FF3D` (pitch-line green) used sparingly — CTA underline, eyebrow dot, live indicator.
- **Type**: Instrument Serif (display/wordmark), Inter (body), JetBrains Mono (eyebrows/labels/stats). Loaded via `<link>` in `__root.tsx` head.
- **Iconography**: `lucide-react` throughout (premium, consistent line set) — Radio, Wallet, Cpu, Users, Trophy, Zap, Radar, etc. Rendered at 1.5px stroke on dark for a refined feel.

## 2. Routes & pages
File-based routes under `src/routes/`:
- `index.tsx` — Landing (scroll-frame hero + all sections)
- `matches.tsx` — Live match board (list of R16 fixtures, join room CTA)
- `matches.$matchId.tsx` — Match room detail (AI analysis panel, peer chat placeholder, pool card)
- `how-it-works.tsx` — Deep dive on Pears + QVAC + WDK, each as a chapter
- `merch.tsx` — Brand/merch preview (hoodie, tee, cap mockups using the logo lockups on flat color)
- `manifesto.tsx` — Long-form editorial: "Why football belongs to fans"
- `download.tsx` — Get the Pears app (mac/win/linux buttons + verify steps)
- `_app.tsx` — pathless layout wrapping dashboard routes (shared sidebar)
- `_app/dashboard.tsx` — Fan dashboard home (wallet balance, active rooms, AI credits, recent tips)
- `_app/dashboard.wallet.tsx` — WDK wallet (balance, send/receive, tx history)
- `_app/dashboard.rooms.tsx` — Joined P2P rooms + peer counts
- `_app/dashboard.pools.tsx` — Prediction pools joined/created
- `_app/dashboard.ai.tsx` — Local AI model status (QVAC), model picker mock

Each route sets its own `head()` with real title/description/og tags. `og:image` only on leaf routes where a hero image exists (added later once frames are supplied).

## 3. Landing page composition (per spec)
Components:
- `src/components/ScrollytellingCanvas.tsx` — fixed z-0 black canvas, scroll-scrubbed frames, rAF loop with last-drawn guard, eager-load first 24 w/ `fetchPriority="high"`, batched `setTimeout` pump for the rest, DPR-capped ResizeObserver sizing, cover-fit math, backward-then-forward nearest-frame search, GSAP mouse parallax (desktop + no reduced-motion only), `aria-hidden`. Frame count auto-detected via `/frames/manifest.json` (falls back to probing).
- `src/components/SiteHeader.tsx` — glass card, slides out 500–800px, slides back on scroll-up. Logo / nav / CTA.
- `src/components/Hero.tsx` — 12-col grid, min-h-screen, bottom-left anchor, clamp() headline in Instrument Serif, mono eyebrow, primary + secondary CTA.
- `src/components/ScrollReveal.tsx` — word-by-word blur+translate reveal via IntersectionObserver, respects reduced-motion.
- `src/components/sections/` — `WhatItIs.tsx`, `HowItWorks.tsx` (3 steps: Join room / Run local AI / Tip in USDt), `Features.tsx` (2×3 grid: P2P Rooms, Local AI, Self-custody wallet, Prediction pools, Offline-first, No servers), `Proof.tsx` (mono stats: 0 servers, 100% on-device AI, 1 currency USDt, 48 matches), `FinalCTA.tsx`, `SiteFooter.tsx` (glass, links, small print).
- 200px vertical spacers desktop / 120px mobile. All content in `relative z-10` wrapper.

## 4. Dashboard shell
- `_app.tsx` renders `<DashboardShell>` with left glass sidebar (logo, nav to Wallet/Rooms/Pools/AI, peer/connection status), top bar with wallet balance chip + LIVE dot, `<Outlet />`.
- All dashboard subpages use the same card language: glass panels, mono labels, serif numbers for big stats, lucide icons.
- Data is mocked from a single `src/lib/mock-data.ts` (no backend wiring — frontend/presentation only, as per instructions).

## 5. Head metadata (per route)
Titles like:
- Landing: `KICKOFF — P2P football intelligence for WC26`
- Dashboard: `Dashboard — KICKOFF`
- Match: `${home} vs ${away} — KICKOFF`
Root `__root.tsx` head updated to KICKOFF defaults (removing "Lovable App" placeholders) + font `<link>` tags for Instrument Serif, Inter, JetBrains Mono.

## 6. Motion & a11y
- GSAP added via `bun add gsap` for parallax + reveal tweens.
- All motion gated on `prefers-reduced-motion`.
- Single `<h1>` per page, semantic `<section>`/`<article>`, canvas `aria-hidden`.
- No layout shift (reserved heights on cards, no images below fold beyond logos/merch mockups which are inline SVG).

## 7. Technical notes
- Tailwind v4 tokens: add `--color-accent-pitch: #C6FF3D` and font-family tokens to `src/styles.css` under `@theme`.
- No dark overlays / gradients over the canvas — ever. Contrast handled via text weight + mono labels + glass cards only where spec allows (header/footer/floating cards).
- All routes match `createFileRoute` naming rules and TanStack conventions already in the repo.

## Deliverables checklist
Brand: `Logomark.tsx`, `Wordmark.tsx`, `LogoLockup.tsx`, merch mockups on `/merch`.
Landing: `ScrollytellingCanvas`, `SiteHeader`, `Hero`, `ScrollReveal`, 6 section components, `SiteFooter`, composed in `routes/index.tsx`.
Pages: matches (list + detail), how-it-works, merch, manifesto, download.
Dashboard: `_app` layout + 4 subroutes with shared shell.
Root: font `<link>`s + KICKOFF meta in `__root.tsx`; accent + fonts in `styles.css`.

Once approved I'll ship it in one pass. If you upload the frame JPGs before/after, they'll drop straight into `/public/frames/` and the canvas picks them up.