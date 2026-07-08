# Win Strategy — Maximize Cup Champion ($5,000) + Track Prizes

Recommendations beyond the bible. Fact-checked against [DoraHacks rules](https://dorahacks.io/hackathon/tether-developers-cup/detail).

---

## 1. Follow the rules literally (non-negotiable)

Judges stated:
- QVAC track: **all AI on device, no cloud AI**
- Pears track: **Pears Stack, not plain WebRTC**
- WDK track: **real WDK**, not mock wallet UI

**Do not** substitute Venice/OpenAI for the offline demo moment — that is the single easiest way to lose QVAC track.

---

## 2. Bible corrections that increase credibility

| Bible issue | Fix | Why judges care |
|-------------|-----|-----------------|
| Wrong npm packages | Use `@qvac/sdk`, `@tetherto/wdk` | Shows you read official docs |
| Express-only P2P | Pear app + Hyperswarm | Pears track authenticity |
| Admin-held pools | Demo clearly + escrow roadmap | Honesty beats fake "smart contract" |
| Mock frontend | Wire to real localhost API | "Build something real" |

---

## 3. Demo video beats feature count

The bible's **3-minute script** is your judging UX. Optimize for:

1. **0:30 — WiFi OFF** → QVAC analyzes (visible in OS/browser)
2. **1:00 — WiFi ON** → share to room → second tab receives (Network tab open, no chat server)
3. **1:20 — WDK tip** → tx hash on screen
4. **1:45 — Pool** → create, join, settle with real testnet movement

Record with **Network inspector visible**. Narrate: "zero cloud AI, zero chat server, self-custodial tip."

---

## 4. Architecture judges will respect

```
┌─────────────────────────────────────────────────────────┐
│  Lovable Frontend (Cloudflare) — marketing + dashboard  │
│  fetch → http://localhost:3001 when running locally     │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│  Local API (Express :3001)                              │
│  ├── /api/ai/*     → @qvac/sdk (LOCAL)                  │
│  ├── /api/rooms/*  → Hyperswarm (P2P)                   │
│  └── /api/wallet/* → @tetherto/wdk (testnet)            │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│  Pear Runtime App (Pears track proof)                   │
│  Bare + hyperswarm + optional QVAC worker               │
└─────────────────────────────────────────────────────────┘

Optional online layer:
  TinyFish → live match stats JSON → fed into QVAC prompts
  (Never replaces QVAC inference)
```

---

## 5. Differentiators vs other teams

| Most teams will | KICKOFF should |
|-----------------|----------------|
| Pick one track | **All three load-bearing** |
| Cloud GPT wrapper | **Offline inference proof** |
| Centralized chat | **Hyperswarm + inspector proof** |
| Fake wallet balance | **Testnet tx hash** |
| Generic football app | **Live WC 2026 R16 context** |
| Ghana absent | **Represent Ghana 🇬🇭** in pitch + README |

---

## 6. TinyFish / Venice / OpenAI — how to use without losing

| Service | Winning use | Losing use |
|---------|-------------|------------|
| **TinyFish** | Auto-fill live score/stats into match form | Replace QVAC analysis |
| **Venice** | Generate README, pitch deck, merch copy | Power "Analyze" button |
| **OpenAI** | Dev tooling, test fixtures | Any judged AI output |
| **Azure** | Host docs, CI runners, Key Vault | Azure OpenAI in demo |

---

## 7. Submission checklist (bible + extras)

### Bible checklist
- [ ] Pear project initialized
- [ ] QVAC model downloaded and loads
- [ ] Two tabs Hyperswarm chat
- [ ] WiFi-off QVAC works
- [ ] WDK wallet + tip + pool E2E
- [ ] Frontend connected to local API
- [ ] 3-min demo video
- [ ] Public GitHub MIT/Apache
- [ ] DoraHacks: all 3 tracks selected
- [ ] Ghana representation

### Extra for Cup Champion
- [ ] `docs/memory/` shows you verified official APIs
- [ ] `packages/contracts/` — typed protocols
- [ ] `.env.example` — keys documented honestly
- [ ] `README.md` — architecture diagram + setup in < 5 min
- [ ] Network tab in video — zero chat server calls
- [ ] `GET /api/health` shows `qvac: true, wallet: true, p2p: true`

---

## 8. Timeline discipline (today = Jul 8)

**First cut is today 23:59 GMT-7.**

Minimum viable submission today:
1. Working local API with **real QVAC** OR **real Hyperswarm** + **real WDK** (at least 2 of 3)
2. Demo video showing what works
3. Honest README listing what's complete vs next for Jul 12

Do not wait for "perfect enterprise" before first submit — knockout allows resubmission Jul 12.

---

## 9. What NOT to promise judges

- "Unhackable" / "North Korea-proof" — see `06-SECURITY-REALITY-CHECK.md`
- "Smart contract pools" if using admin wallet
- "Production mainnet" if demo is testnet
- Cloud AI while claiming QVAC track

**Honesty + working demo > buzzwords.**
