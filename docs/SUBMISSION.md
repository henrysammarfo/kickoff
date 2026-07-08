# Hackathon Submission Checklist

## DoraHacks

- [ ] Register all team members
- [ ] Select tracks: **Pears + QVAC + WDK**
- [ ] Nation: **Ghana 🇬🇭**
- [x] Public repo link — https://github.com/henrysammarfo/kickoff
- [ ] Demo video ≤ 3 min (YouTube unlisted)
- [x] Disclose third-party services (see README)

## Repo

- [x] MIT LICENSE
- [x] README with judge setup (ports 3001 API / 3002 frontend)
- [x] `.env.example`
- [x] `npm run api:smoke` + `npm run api:stress`
- [x] WC26 fixtures verified (8 R16 + 4 QF in catalog)
- [x] Dashboard responsive on mobile widths

## Demo script (3 min)

**Setup:** `cd api && npm run dev` then `npm run dev` at repo root → http://localhost:3002

1. **Landing / Matches** — show QF fixtures (France vs Morocco, Norway vs England, etc.)
2. **Match room** — `/matches/mar-fra` → create/join P2P room
3. WiFi **off** → QVAC **Analyze** → confirm `ranLocally: true`
4. WiFi **on** → two-tab P2P chat (same room topic)
5. **Dashboard** → wallet balance (WDK) → tip or pool create/join → tx hash
6. Optional: `cd pears && KICKOFF_MATCH=France-Morocco-QF node app.js` for standalone Pear proof

## Third-party disclosure

- TinyFish (optional live data — catalog works without key)
- Sepolia public RPC
- npm: `@qvac/sdk`, `@tetherto/wdk`, `hyperswarm`

**Not used for judged AI:** OpenAI, Venice, Azure OpenAI
