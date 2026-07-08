# KICKOFF

P2P football intelligence for World Cup 2026 — **Pears (P2P) + QVAC (local AI) + WDK (self-custodial USDt)**.

## Docs

| Document | Description |
|----------|-------------|
| [KICKOFF_BUILD_GUIDE.md](./docs/KICKOFF_BUILD_GUIDE.md) | Full build spec (team bible) |
| [docs/memory/](./docs/memory/) | Verified facts, API keys, gaps, win strategy |

## Quick start

### Frontend (TanStack Start)

```bash
npm install
npm run dev          # http://localhost:5173
```

Point the UI at the local API (optional — defaults to `http://127.0.0.1:3001`):

```bash
echo 'VITE_API_BASE=http://127.0.0.1:3001' >> .env
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

### QVAC configuration

Local inference uses `@qvac/sdk` with a registry model by default. Optional overrides:

```bash
# OpenAI-compatible local server (e.g. from linestackruntime reference project)
export QVAC_HTTP_URL=http://127.0.0.1:8080

# Local GGUF file
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
