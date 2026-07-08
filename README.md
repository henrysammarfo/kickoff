# KICKOFF

P2P football intelligence for World Cup 2026 — **Pears (P2P) + QVAC (local AI) + WDK (self-custodial USDt)**.

## Docs

| Document | Description |
|----------|-------------|
| [KICKOFF_BUILD_GUIDE.md](./docs/KICKOFF_BUILD_GUIDE.md) | Full build spec (team bible) |
| [docs/memory/](./docs/memory/) | Verified facts, API keys, gaps, win strategy |

## Quick start

### Frontend (Lovable / TanStack)

```bash
bun install
bun run dev
```

### Backend (QVAC + Hyperswarm + WDK)

```bash
cp .env.example .env
cd api && npm install
npm run dev          # http://127.0.0.1:3001/api
```

Smoke test (server must be running):

```bash
npm run api:smoke
```

### linestackruntime / local QVAC

If you built **linestackruntime** locally, point the API at it:

```bash
# Option A — custom bare/linestack build directory
export QVAC_LINESTACK_RUNTIME_PATH=/path/to/linestackruntime

# Option B — OpenAI-compatible HTTP server from your runtime
export QVAC_HTTP_URL=http://127.0.0.1:8080

# Option C — local GGUF file
export QVAC_MODEL_PATH=/path/to/model.gguf
```

### Pear P2P app

```bash
cd pears && npm install
KICKOFF_MATCH=France-Paraguay-R16 node app.js
# Or: pear run .  (with Pear CLI installed)
```

## API surface

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Subsystem status |
| `POST /api/ai/analyze` | QVAC local match analysis |
| `POST /api/rooms/join` | Join Hyperswarm match room |
| `GET /api/wallet/balance` | WDK self-custodial balance |
| `POST /api/wallet/tip` | Tip fan in USDt (or ETH demo fallback) |
| `POST /api/pools/create` | Create prediction pool |

## Hackathon

[Tether Developers Cup](https://dorahacks.io/hackathon/tether-developers-cup/detail) — representing **Ghana 🇬🇭**
