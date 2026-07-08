# Hackathon Verified Facts (Web-Checked)

**Source:** [DoraHacks — Tether Developers Cup](https://dorahacks.io/hackathon/tether-developers-cup/detail)  
**Verified:** 2026-07-08

---

## Prize pool (8,000 USDt total)

| Prize | Amount |
|-------|--------|
| **Cup Champion** (best overall) | 5,000 USDt |
| **Pears track winner** | 1,000 USDt |
| **QVAC track winner** | 1,000 USDt |
| **WDK track winner** | 1,000 USDt |

KICKOFF strategy: **one project, all three tracks** — Cup Champion requires authentic use of Pears + QVAC + WDK.

---

## Timeline (knockout tournament)

| Date | Event |
|------|-------|
| Through Jul 6 | Registration open; field locks Jul 6 |
| **Jul 8 @ 23:59 GMT-7** | **First cut** — submit project + demo; top 16 advance |
| Jul 12 | Second cut (semifinals) — 16 → 4 finalists |
| **Jul 14 @ 23:59 GMT-7** | Final submission deadline |
| Jul 15–18 | Top 4 pitch live to Tether team |
| **Jul 19** | Winners announced (same day as World Cup Final at MetLife) |

> DoraHacks UI timer may show Jul 14 — **first cut is Jul 8**. Miss Jul 8 = eliminated regardless of timer.

---

## Official track requirements (verbatim intent)

### Pears (P2P)
- Apps deployed with **Pear CLI** and **pear-runtime**
- Networking must use **Pears Stack** building blocks: Hyperswarm, Hypercore, Autobase, etc.
- **Plain WebRTC does not count**
- Docs: https://docs.pears.com/reference/#building-blocks

### QVAC (Local AI)
- **All AI must run on the user's device through the QVAC SDK**
- **No cloud AI**
- No API keys for inference in the judged demo path
- Docs: https://docs.qvac.tether.io / https://qvac.tether.io

### WDK (Wallet)
- Self-custodial wallet flows via **Wallet Development Kit**
- Docs: https://docs.wdk.tether.io / https://wdk.tether.io

---

## Submission requirements

- Public GitHub repo (MIT or Apache 2.0)
- Demo video (unlisted YouTube acceptable)
- DoraHacks BUIDL submission with GitHub link
- Select **all three tracks**: Pears + QVAC + WDK
- Represent a nation (build guide: **Ghana 🇬🇭**)
- List all outside services, APIs, and pre-built parts used

---

## What disqualifies or hurts scoring

| Action | Risk |
|--------|------|
| Cloud LLM (OpenAI, Venice, Azure OpenAI) as **match analysis AI** in demo | **Violates QVAC track** |
| WebRTC-only chat without Hyperswarm/Pears | **Violates Pears track** |
| Mock wallet with no WDK integration | **Violates WDK track** |
| Tether logo on unrelated app | Judges explicitly reject |
| Missing Jul 8 demo submission | **Eliminated** |

---

## Official SDK package names (not in build guide)

| Build guide says | Official npm / docs |
|------------------|---------------------|
| `@tether/qvac-sdk` | **`@qvac/sdk`** |
| `@tether/wdk` | **`@tetherto/wdk`** |
| `qvac pull` CLI | Verify against current QVAC docs — SDK uses `loadModel()` with model registry |

---

## World Cup context (build guide)

- WC Final: **July 19, 2026** — MetLife Stadium
- Build guide R16 examples: Canada vs Morocco, France vs Paraguay
- Product must feel **live and useful now**, not theoretical
