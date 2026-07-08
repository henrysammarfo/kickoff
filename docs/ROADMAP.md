# Product Roadmap

World Cup 2026 is the **launch event**. KICKOFF is built as a seasonal football intelligence platform.

## Phase 1 — WC26 Launch (Jul 2026) ✅ target

- [x] QVAC local match analysis
- [x] Hyperswarm P2P fan rooms
- [x] WDK tips + prediction pools (testnet)
- [x] TinyFish live score ingestion (optional)
- [x] WC26 knockout catalog (R16 results + QF draw)
- [x] Marketing site + responsive dashboard
- [ ] Demo video (3 min)

## Phase 2 — Tournament mode (Jul–Aug 2026)

- Live fixtures for all WC26 knockout stages
- Player-level stats (lineups, cards, xG) via TinyFish structured extract
- Pool escrow smart contract (WDK + on-chain settlement)
- Pear mobile shell (iOS/Android via Pear runtime)

## Phase 3 — Seasonal leagues (Sep 2026+)

| League | Data source | AI |
|--------|-------------|-----|
| La Liga | TinyFish + league APIs | QVAC local |
| Premier League | Same pipeline | Same |
| AFCON / CAF | Ghana home market | Same |

Architecture stays identical: **ingest online → analyze offline**.

## Phase 4 — Platform

- Creator tipping rails (WDK native USDt)
- Local RAG over your room history (QVAC `ragSearch`)
- Delegated inference (QVAC P2P — phone offloads to laptop)
- Merch drop + community pools

## What we won't do

- Cloud LLM for match analysis (QVAC track violation)
- Centralized chat server (Pears track violation)
- Custodial wallets (WDK track violation)
