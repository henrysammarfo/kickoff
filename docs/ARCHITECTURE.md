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

## System overview

```mermaid
flowchart TB
  subgraph Device["User device"]
    FE["Frontend · TanStack Start<br/>marketing + dashboard"]
    Pear["Pear app · pears/<br/>standalone P2P shell"]
  end

  subgraph API["Local API · Express :3001"]
    M["/api/matches/*"]
    A["/api/ai/*"]
    R["/api/rooms/*"]
    W["/api/wallet/*"]
    P["/api/pools/*"]
  end

  subgraph Stacks["Tether hackathon stacks"]
    QVAC["QVAC · @qvac/sdk<br/>on-device LLM"]
    HS["Pears · Hyperswarm<br/>P2P match rooms"]
    WDK["WDK · @tetherto/wdk<br/>self-custodial wallet"]
  end

  subgraph External["External (non-AI)"]
    TF["TinyFish · live score ingest"]
    RPC["Sepolia public RPC"]
  end

  FE --> API
  Pear --> HS
  M --> TF
  A --> QVAC
  R --> HS
  W --> WDK
  P --> WDK
  WDK --> RPC
```

## Request flows

### Live score refresh

```mermaid
sequenceDiagram
  participant B as Browser
  participant API as LiveMatchesService
  participant TF as TinyFish
  participant Cat as WC26 catalog

  B->>API: GET /api/matches/live
  alt cache fresh (&lt; 60s)
    API-->>B: cached fixtures + scores
  else cache stale + API key set
    API->>TF: Search / Fetch / Agent
    TF-->>API: structured match JSON
    API->>Cat: merge into catalog
    API-->>B: live matches JSON
  else no API key
    API-->>B: static fixtures only
  end
```

### Match analysis (judged path)

```mermaid
sequenceDiagram
  participant B as Browser
  participant API as Express /api/ai
  participant AI as FootballAI
  participant Q as QVAC local LLM

  B->>API: POST /api/ai/analyze
  Note over B,API: score, minute, shots, possession, events
  API->>AI: analyze(payload)
  AI->>Q: on-device inference
  Q-->>AI: analysis + prediction
  AI-->>API: ranLocally true
  API-->>B: JSON response
```

### P2P chat

```mermaid
sequenceDiagram
  participant A as Fan tab A
  participant API as Express /api/rooms
  participant HS as Hyperswarm DHT
  participant B as Fan tab B

  A->>API: POST /api/rooms/join
  API->>HS: bootstrap local peer
  B->>API: POST /api/rooms/join
  B->>API: POST /api/rooms/message
  API->>HS: broadcast envelope
  HS-->>A: message via P2P
  Note over API,HS: API bootstraps peers only — chat does not route through your server
```

### WDK tip & pool settle

```mermaid
sequenceDiagram
  participant B as Browser
  participant API as Express /api/wallet
  participant T as FanTipper / PredictionPool
  participant W as WDK account
  participant C as Sepolia

  B->>API: POST /api/wallet/tip
  API->>T: tip(recipient, amountUsdt)
  T->>W: ERC-20 transfer
  W->>C: signed transaction
  C-->>W: tx hash
  W-->>API: receipt
  API-->>B: txHash + currency USDt
```

## Deployment

```mermaid
flowchart LR
  subgraph Hosted["Can host (static)"]
    Vercel["Vercel / Cloudflare Pages"]
    FE2["Frontend build<br/>npm run build"]
  end

  subgraph Local["Must run locally (demo)"]
    API2["API · api/<br/>QVAC + WDK + P2P bootstrap"]
    Model["QVAC model<br/>~/.qvac/models"]
    Pear2["Pear CLI · pear run ."]
  end

  FE2 --> Vercel
  FE2 -.->|HTTP :3001| API2
  API2 --> Model
  Pear2 -.->|Hyperswarm| API2
```

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
