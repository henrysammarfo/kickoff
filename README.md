# KICKOFF

P2P football intelligence for World Cup 2026 — **Pears (P2P) + QVAC (local AI) + WDK (self-custodial USDt)**.

## Docs

| Document | Description |
|----------|-------------|
| [KICKOFF_BUILD_GUIDE.md](./docs/KICKOFF_BUILD_GUIDE.md) | Full build spec (team bible) |
| [docs/memory/](./docs/memory/) | Verified facts, API keys, gaps, win strategy |

## Stack

- **Frontend:** TanStack Start + React (Lovable / Cloudflare)
- **Backend (to build):** Express :3001 + `@qvac/sdk` + Hyperswarm + `@tetherto/wdk`

## Hackathon

[Tether Developers Cup](https://dorahacks.io/hackathon/tether-developers-cup/detail) — representing **Ghana 🇬🇭**

## Quick start (frontend)

```bash
bun install
bun run dev
```

Local API setup: see `docs/KICKOFF_BUILD_GUIDE.md` and `docs/memory/04-IMPLEMENTATION-GAP-ANALYSIS.md`.
