# Implementation Gap Analysis

**Repo:** https://github.com/henrysammarfo/kickoff  
**Audited:** 2026-07-08

---

## Executive summary

| Layer | Bible target | Repo today | Gap |
|-------|-------------|------------|-----|
| Marketing frontend | Lovable UI | ✅ ~90% built | Frames synced (181 JPGs), merch assets missing |
| Dashboard UI | Mock → real | 🟡 UI only | All data from `mock-data.ts` |
| Local API (`api/server.js`) | Express :3001 | ❌ Missing | Entire backend |
| QVAC integration | `@qvac/sdk` | ❌ Missing | No AI deps |
| Pears / Hyperswarm | Pear app + rooms | ❌ Missing | Copy only |
| WDK integration | `@tetherto/wdk` | ❌ Missing | Copy only |
| Contracts / protocols | Message types + Zod | ❌ Missing | No shared schemas |
| Tests / smoke | 0 issues | ❌ Not run | No test suite |
| Security hardening | Enterprise | ❌ N/A | Frontend prototype only |

**Honest status:** Beautiful frontend prototype. **Zero hackathon-core integration implemented.**

---

## Frontend (what exists)

### Implemented
- TanStack Start + React 19 + Tailwind v4
- Landing: ScrollytellingCanvas, Hero, sections, header/footer
- Routes: `/`, `/matches`, `/matches/:id`, `/how-it-works`, `/manifesto`, `/download`, `/merch`
- Dashboard: `/dashboard`, wallet, rooms, pools, ai
- Brand SVG components
- Per-route SEO `head()`
- **181 scroll frames** in `public/frames/` (synced commit `9c4523c`)

### Broken / placeholder
- `src/assets/` — merch JPGs imported but **files missing** (build risk)
- All buttons: Send, Tip, Join Pool, Analyze, Pull model — **no handlers**
- `ScrollytellingCanvas` — works if frames present ✅
- TanStack Query — wired, **unused**
- shadcn/ui — installed, **unused** in pages

---

## Backend (what bible requires — all missing)

```
pears/p2p/room.js          ❌
pears/p2p/messages.js      ❌
qvac/football-ai.js        ❌
qvac/prompts.js            ❌
wdk/wallet.js              ❌
wdk/tip.js                 ❌
wdk/pool.js                ❌
api/server.js              ❌
api/routes/*.js            ❌
```

---

## Dependencies gap

**Bible requires:**
```
express cors hyperswarm b4a compact-encoding dotenv
@qvac/sdk
@tetherto/wdk (+ chain modules)
uuid
```

**package.json today:** React UI stack only — **none of the above**.

---

## API surface gap

| Endpoint | Bible | Repo |
|----------|-------|------|
| `POST /api/ai/analyze` | QVAC local | ❌ |
| `POST /api/ai/predict` | QVAC local | ❌ |
| `GET /api/ai/status` | Model status | ❌ |
| `POST /api/rooms/join` | Hyperswarm | ❌ |
| `POST /api/rooms/message` | P2P broadcast | ❌ |
| `GET /api/rooms/:name/messages` | Poll | ❌ |
| `GET /api/wallet/balance` | WDK | ❌ |
| `POST /api/wallet/tip` | WDK | ❌ |
| `POST /api/pools/create` | WDK | ❌ |
| `POST /api/pools/:id/join` | WDK | ❌ |
| `POST /api/pools/:id/settle` | WDK | ❌ |
| `GET /api/health` | Health | ❌ |

---

## Contracts / types gap

Need shared Zod/TypeScript contracts for:
- `MatchAnalysisRequest` / `MatchAnalysisResponse`
- `P2PMessage` union: `join | chat | tip | pool`
- `WalletBalance`, `TipRequest`, `TipResult`
- `PredictionPool`, `PoolEntry`, `SettleResult`

Location target: `packages/contracts/` or `api/contracts/`

---

## Test / smoke gap

**Cannot claim "0 issues" today.** Required before submission:

| Test | Purpose |
|------|---------|
| `bun run build` | Frontend compiles |
| API health smoke | All subsystems ready |
| QVAC inference test | Returns analysis < 30s |
| Two-peer Hyperswarm test | Messages cross tabs |
| WDK tip test | Testnet tx hash returned |
| Pool E2E | create → join → settle |
| WiFi-off manual test | Demo script minute 0:30 |

---

## Deployment gap

| Target | Status |
|--------|--------|
| Lovable / Cloudflare | Frontend only — configured |
| Local Pear app | Not created |
| Local API :3001 | Not created |
| Azure | Not configured (optional) |

---

## Priority build order (full production path)

1. **Monorepo scaffold** — `api/`, `pears/`, `qvac/`, `wdk/`, `packages/contracts/`
2. **Contracts first** — Zod schemas from bible message types
3. **QVAC** — real `@qvac/sdk` + `prompts.js` from bible
4. **Express API** — wire QVAC routes; prove `/api/ai/status`
5. **Hyperswarm room** — port bible `room.js`; two-tab test
6. **WDK** — wallet + tip on testnet
7. **Pools** — admin model for hackathon, escrow doc for prod
8. **Frontend** — replace `mock-data.ts` with `fetch('http://localhost:3001/api/...')`
9. **Pear app** — package for Pears track credibility
10. **TinyFish** (optional) — live stats feeder, not AI
11. **Tests + demo video** — bible 3-minute script shot-for-shot

---

## Docs gap (this PR fixes)

- `KICKOFF_BUILD_GUIDE.md` — now in `docs/`
- Memory MDs — `docs/memory/`
- Root `README.md` — still missing
