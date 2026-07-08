# Security Reality Check

**No hallucinations.** Enterprise-grade is a process and architecture — not a marketing claim.

---

## What we cannot honestly claim

| Claim | Reality |
|-------|---------|
| "North Korea hackers can't hack it" | **False.** No system is provably unhackable. |
| "Zero bugs" | **Unprovable** without formal verification + ongoing audits. |
| "Absolutely 0 compile issues" | Must be **measured** by CI — not asserted. |
| "Enterprise grade done" | Repo is **frontend prototype** — backend/security not built. |

---

## What "production enterprise grade" actually means for KICKOFF

### Wallet (WDK)
- [ ] User keys never touch KICKOFF servers (self-custodial)
- [ ] Seed encrypted at rest (PIN/biometric)
- [ ] Input validation on addresses before send
- [ ] Testnet vs mainnet clearly separated
- [ ] Rate limiting on tip endpoints (local API)
- [ ] Pool escrow via WDK programmable payments (post-hackathon) — bible admits admin model is hackathon-only

### P2P (Hyperswarm)
- [ ] Encrypted connections (Hyperswarm default via secretstream)
- [ ] Topic derivation documented (SHA256 of match name)
- [ ] Optional firewall callback to block peers
- [ ] Message size limits (prevent DoS)
- [ ] No PII in DHT announcements

### AI (QVAC)
- [ ] Prompt injection mitigations on user-supplied chat text
- [ ] Model runs sandboxed on device
- [ ] No user data sent to cloud in QVAC path

### API (local Express)
- [ ] Bind to `127.0.0.1` only (not `0.0.0.0`) for local demo
- [ ] CORS restricted to known frontend origin in prod
- [ ] Zod validation on all request bodies
- [ ] No secrets in repo — `.env` gitignored
- [ ] `helmet`, rate-limit if exposed beyond localhost

### Frontend
- [ ] CSP headers when deployed
- [ ] No `dangerouslySetInnerHTML` on user chat
- [ ] Sanitize peer messages before render

### Keys you listed
| Key | Risk if leaked | Mitigation |
|-----|----------------|------------|
| OpenAI | Billing abuse | Never in frontend; Key Vault / env only |
| Venice | Billing abuse | Same |
| TinyFish | Credit drain | Server-side only; rotate key |
| Azure | Infra takeover | Managed identity; least privilege RBAC |

---

## Threat model (honest)

| Threat | Current risk | After full build |
|--------|-------------|------------------|
| Stolen API keys | N/A (not integrated) | Medium — use Key Vault |
| Fake peer messages | N/A | Medium — sign messages with wallet key |
| Pool admin runs away with pot | N/A | High in hackathon admin model — disclose |
| Prompt injection in AI | N/A | Low–medium |
| XSS in chat UI | Low (static mock) | Medium when live |
| Man-in-middle on localhost | Low | Low |

---

## Path to defensible security story for judges

Say this:

> "Fans hold their own keys via WDK — we never custody funds. P2P chat uses Hyperswarm encrypted streams with no central server. AI runs locally via QVAC so match data doesn't leave the device. We're on testnet for the hackathon; mainnet would add escrow, message signing, and a third-party audit."

Do **not** say:

> "It's unhackable."

---

## Testing required before "0 issues" claim

```bash
# Frontend
bun run lint
bun run build

# Backend (when exists)
cd api && npm test
npm audit

# Manual smoke
curl localhost:3001/api/health
# Two-browser Hyperswarm test
# WDK testnet tip with small amount
```

CI target: GitHub Actions on every push to `main`.

---

## Bible security notes to preserve

- WDK: "User holds their own keys — KICKOFF never has custody" ✅
- QVAC: "No data leaves the machine" ✅ (if implemented correctly)
- Pears: "No server. No WebSocket to a backend" ✅ (for chat path)

## Bible security notes to fix

- Pool admin holds all stakes — **centralization risk** — document and plan escrow
- `cors({ origin: '*' })` in bible `server.js` — **dev only**, tighten for prod
- Default PIN `'1234'` / `'kickoff2026'` in bible — **demo only**, never prod
