# Build Guide Corrections (Bible vs Reality)

The uploaded `KICKOFF_BUILD_GUIDE.md` is the **team bible**. This file tracks every known deviation from official docs — **do not hallucinate APIs from the bible when they conflict with sources below**.

**Verified:** 2026-07-08

---

## 1. Package names

| Bible (`KICKOFF_BUILD_GUIDE.md`) | Correct (official) | Source |
|----------------------------------|-------------------|--------|
| `@tether/qvac-sdk` | `@qvac/sdk` | [npm](https://www.npmjs.com/package/@qvac/sdk), [qvac.tether.io/dev/sdk](https://qvac.tether.io/dev/sdk/) |
| `@tether/wdk` | `@tetherto/wdk` | [wdk.tether.io](https://wdk.tether.io/), [docs.wdk.tether.io](https://docs.wdk.tether.io/sdk/get-started/) |
| `npm install @tether/wallet-development-kit` | Use modular `@tetherto/wdk` + chain modules | WDK docs |

---

## 2. QVAC API shape

**Bible assumes:**
```javascript
const { QVAC } = require('@tether/qvac-sdk');
this.qvac = new QVAC({ model, modelPath, offline: true });
await this.qvac.load();
const response = await this.qvac.generate({ systemPrompt, userPrompt, maxTokens, temperature });
```

**Official SDK pattern:**
```javascript
import { loadModel, completion, unloadModel } from "@qvac/sdk";

const modelId = await loadModel({ modelType: "llm" /* or modelSrc */ });
const response = await completion({
  modelId,
  history: [
    { role: "system", content: "..." },
    { role: "user", content: "..." }
  ],
  stream: false,
});
const text = await response.text;
await unloadModel({ modelId });
```

**Action:** Implement against `@qvac/sdk` docs, not bible pseudocode. Keep `prompts.js` from bible — prompts are fine.

**CLI fallback in bible** (`qvac run phi-3-mini-4k-instruct "..."`) — verify CLI still exists; SDK path is preferred.

---

## 3. WDK API shape

**Bible assumes:**
```javascript
const { WDK, Wallet } = require('@tether/wdk');
this.wdk = new WDK({ network: 'testnet' });
this.wallet = await this.wdk.createWallet({ name, pin });
await this.wallet.getBalances(); // USDt, USAt, XAUt
await wallet.send({ to, amount, currency: 'USDt', memo });
await this.wdk.faucet({ address, amount, currency: 'USDt' });
```

**Official WDK pattern:**
```javascript
import WDK from '@tetherto/wdk';
const seedPhrase = WDK.getRandomSeedPhrase();
const wdk = new WDK(seedPhrase);
const account = await wdk.getAccount('ethereum', 0);
// Multi-chain via registerWallet() with @tetherto/wdk-wallet-evm etc.
```

**Action:** WDK is **modular** — register per-chain wallet managers. Bible's single `getBalances()` / `faucet()` API must be mapped to real WDK testnet docs. Do not invent `WDK_TETHER_ENDPOINT` behavior without verifying.

---

## 4. Pears / Hyperswarm

**Bible `KickoffRoom` class** — conceptually aligned with [Hyperswarm docs](https://docs.pears.com/reference/building-blocks/hyperswarm/):
- Topic = 32-byte buffer (bible uses SHA256 of `kickoff:${matchName}` — valid approach)
- `swarm.join(topic, { client: true, server: true })`
- `connection` event → `conn.write` / `conn.on('data')`

**Correction:** Must run inside **Pears/Bare runtime** for hackathon track credit, not only Node `require('hyperswarm')` in a vanilla Express server. Pear app + local API bridge is the winning architecture.

---

## 5. Project structure

**Bible expects:**
```
kickoff/
├── pears/
├── qvac/
├── wdk/
├── api/
└── frontend (Lovable)
```

**Repo today:** Only Lovable TanStack Start frontend at `/workspace` — **no `pears/`, `qvac/`, `wdk/`, `api/` directories exist**.

---

## 6. Frontend connection

**Bible:** Frontend → `http://localhost:3001/api` (Express)

**Repo today:** TanStack Start on Vite/Nitro/Cloudflare — no backend routes. Must add either:
- Separate `api/` Node process (bible design), OR
- TanStack Start server functions that proxy to local Pear/QVAC/WDK — **still must prove P2P is Hyperswarm, not HTTP chat**

---

## 7. Prediction pool security (bible admits hackathon shortcut)

Bible line 718–719:
> For production: use WDK programmable payments / escrow  
> For hackathon: admin model demonstrated clearly

**Enterprise requirement:** Admin-held pool funds is **not** production-grade. For win + honesty: demo admin model on testnet, document escrow upgrade path in `06-SECURITY-REALITY-CHECK.md`.

---

## 8. Environment variables (bible)

```bash
WDK_NETWORK=testnet
WDK_TETHER_ENDPOINT=https://testnet-api.tether.io  # VERIFY — may not exist as documented
QVAC_MODEL=phi-3-mini-4k-instruct
QVAC_MODEL_PATH=~/.qvac/models/phi-3-mini-4k-instruct
PORT=3001
PEARS_PORT=3002
TEAM_NATION=Ghana
```

**Action:** Replace with verified WDK/QVAC env vars from official quickstarts before `.env` commit.

---

## 9. What the bible gets RIGHT (keep verbatim)

- Three-pillar product thesis (remove any one → product breaks)
- Demo script: WiFi off → QVAC still analyzes
- Demo script: two tabs, Hyperswarm P2P, no central chat server
- Demo script: WDK tip with visible tx hash
- Football prompts in `qvac/prompts.js`
- Message protocol types: `join`, `chat`, `tip`, `pool`
- API route surface: `/api/ai/*`, `/api/rooms/*`, `/api/wallet/*`, `/api/pools/*`
- Frontend four-panel spec (match, P2P room, AI result, wallet)
- Submission checklist at end of bible
