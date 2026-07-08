# API Keys Decision Matrix

**Your keys:** TinyFish AI, Venice API, OpenAI, Microsoft Azure  
**Hackathon rule:** QVAC track = **no cloud AI** on device inference path

---

## Short answer

| Service | Needed for KICKOFF hackathon demo? | Needed for production later? |
|---------|-----------------------------------|---------------------------|
| **QVAC (local)** | ✅ Yes — **no API key** | ✅ Yes |
| **Pears / Hyperswarm** | ✅ Yes — **no API key** | ✅ Yes |
| **WDK** | ✅ Yes — **no API key** (testnet RPC providers may need config) | ✅ Yes |
| **OpenAI** | ❌ **No** for judged AI path | Optional (non-QVAC features only) |
| **Venice API** | ❌ **No** for judged AI path | Optional (private cloud fallback) |
| **TinyFish AI** | ⚠️ Optional — **not for match AI** | ✅ Yes for live stats ingestion |
| **Azure** | ⚠️ Optional — hosting only | ✅ Yes if you host off Lovable |

**Do not put OpenAI/Venice keys in the QVAC inference path.** Judges can ask you to disconnect WiFi — that is the QVAC proof.

---

## Per-service detail

### 1. QVAC — NO KEY
- Package: `@qvac/sdk`
- Models downloaded locally (GGUF / registry)
- Env: model path / model ID only
- **This is your match analysis engine for the demo**

### 2. Pears / Hyperswarm — NO KEY
- Pear CLI + hyperswarm
- DHT is public infrastructure
- No API key

### 3. WDK — NO KEY (wallet keys are user-generated)
- Package: `@tetherto/wdk`
- User seed phrase / PIN — never server-stored
- May need **public RPC URLs** (e.g. `https://eth.drpc.org`) — not secret keys
- Testnet faucet — follow WDK docs (not bible's unverified endpoint)

### 4. TinyFish AI — `TINYFISH_API_KEY`
- **Header:** `X-API-Key`
- **Use case for KICKOFF:** Live match data — scores, lineups, events from the web
- **Endpoints:** Search (free), Fetch (free), Agent/Browser (credits)
- **Do NOT use for:** Offline WiFi-disconnect demo moment
- **Get key:** https://agent.tinyfish.ai/api-keys
- **Example env:**
  ```bash
  TINYFISH_API_KEY=your_key_here
  ```

**Architecture:** TinyFish → structured match JSON → **local QVAC** analyzes stats. Cloud fetches data; AI stays local.

### 5. Venice API — `VENICE_API_KEY`
- **Header:** `Authorization: Bearer <key>`
- **Base URL:** `https://api.venice.ai/api/v1` (OpenAI-compatible)
- **Hackathon:** Do **not** use for `/api/ai/analyze` in submission demo
- **Acceptable use:** Internal dev, content generation, merch copy, non-judged tooling
- **Get key:** Venice API Settings in dashboard
- **Example env:**
  ```bash
  VENICE_API_KEY=your_key_here
  ```

### 6. OpenAI — `OPENAI_API_KEY`
- Same restriction as Venice for QVAC track demo
- Acceptable: CI, docs, optional admin dashboard — **not** the "ANALYZE WITH LOCAL AI" button
- **Example env:**
  ```bash
  OPENAI_API_KEY=sk-...
  ```

### 7. Microsoft Azure
Possible uses (none required for hackathon minimum):

| Azure service | Env vars (typical) | KICKOFF use |
|---------------|-------------------|-------------|
| **Static Web Apps / App Service** | `AZURE_SUBSCRIPTION_ID`, deploy tokens | Host marketing site if not Lovable |
| **Azure OpenAI** | `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY` | ❌ Same QVAC conflict |
| **Key Vault** | `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_SECRET` | Store TinyFish/Venice keys in prod |
| **Container Apps** | ACR credentials | Run Pear/QVAC sidecar in prod |

**Current repo:** Lovable deploys to **Cloudflare** via Nitro — Azure is optional parallel hosting.

---

## Recommended `.env` layout (full production)

```bash
# ── HACKATHON CORE (required) ──────────────────
PORT=3001
WDK_NETWORK=testnet
QVAC_MODEL=llama-3.2-3b-instruct   # verify against @qvac/sdk registry
TEAM_NATION=Ghana

# ── LIVE DATA (optional, online only) ──────────
TINYFISH_API_KEY=

# ── DEV ONLY — NOT IN DEMO PATH ────────────────
VENICE_API_KEY=
OPENAI_API_KEY=

# ── AZURE (optional hosting) ───────────────────
AZURE_SUBSCRIPTION_ID=
AZURE_TENANT_ID=
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
```

**Never commit `.env` to git.** Use `.env.example` with empty values.

---

## What to tell judges

> "Match intelligence runs on-device via QVAC. P2P chat is Hyperswarm with no central server. Tips and pools use WDK self-custodial wallets on testnet. We optionally use TinyFish to ingest live match stats when online — inference still runs locally."
