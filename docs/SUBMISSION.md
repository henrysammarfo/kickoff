# Hackathon Submission Checklist

## DoraHacks

- [ ] Register all team members
- [ ] Select tracks: **Pears + QVAC + WDK**
- [ ] Nation: **Ghana 🇬🇭**
- [ ] Public repo link
- [ ] Demo video ≤ 3 min (YouTube unlisted)
- [ ] Disclose third-party services (see README)

## Repo

- [x] MIT LICENSE
- [x] README with judge setup
- [x] `.env.example`
- [x] `npm run api:smoke` + `npm run api:stress`

## Demo script (3 min)

1. WiFi **off** → QVAC analyze → `ranLocally: true`
2. WiFi **on** → live scores refresh → two-tab P2P chat
3. WDK tip → tx hash
4. Pool create → join → settle

## Third-party disclosure

- TinyFish (optional live data)
- Sepolia public RPC
- npm: `@qvac/sdk`, `@tetherto/wdk`, `hyperswarm`

**Not used for judged AI:** OpenAI, Venice, Azure OpenAI
