# Architecture

## Design principle

**Separate data ingestion from intelligence.**

| Layer | Technology | Cloud? |
|-------|------------|--------|
| Live stats | TinyFish (optional) | Yes — web fetch only |
| Match AI | QVAC `@qvac/sdk` | **No** — on-device |
| Fan chat | Hyperswarm / Pears | **No** — P2P DHT |
| Payments | WDK `@tetherto/wdk` | Chain RPC only |

QVAC supports MCP tool-calling for web search in **general** apps, but KICKOFF uses TinyFish for live football data to keep ingestion structured and QVAC analysis 100% local for judges.

## Request flows

### Live score refresh

```
Browser → GET /api/matches/live
       → LiveMatchesService (60s cache)
       → TinyFish Agent/Fetch (if TINYFISH_API_KEY set)
       → merge into WC26 catalog
       → JSON to frontend
```

### Match analysis (judged path)

```
Browser → POST /api/ai/analyze { score, minute, shots, ... }
       → FootballAI (@qvac/sdk)
       → local LLM inference
       → { analysis, prediction, ranLocally: true }
```

### P2P chat

```
Browser → POST /api/rooms/join  (bootstraps local Hyperswarm peer)
       → POST /api/rooms/message
       → peers receive via Hyperswarm (not via your server)
```

### WDK tip

```
Browser → POST /api/wallet/tip
       → FanTipper → WDK account.sign
       → Sepolia tx hash
```

## Deployment

| Component | Where it runs |
|-----------|---------------|
| Frontend (`npm run build`) | Vercel, Cloudflare Pages, Nitro node-server |
| API (`api/`) | User's laptop (demo) — required for QVAC + WDK |
| Pear app (`pears/`) | User's machine via `pear run` |
| QVAC model | `~/.qvac/models` on user device |

**Why not full cloud deploy?** QVAC track requires on-device inference. The marketing frontend can be hosted; the intelligence stack runs locally beside the judge.

## Package versions (verified Jul 2026)

- `@qvac/sdk` **0.14.1** (latest)
- `@tetherto/wdk` **1.0.0-beta.13**
- `hyperswarm` **4.17.x**
