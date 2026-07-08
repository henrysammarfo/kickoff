# Live API proofs

Captured JSON responses from a running KICKOFF API — for judges and README verification.

## Regenerate

```bash
# Terminal 1
cd api && npm run dev

# Terminal 2
npm run api:proofs
```

Writes fresh files here and updates `LATEST.txt`.

## Files

| File | Endpoint | What it proves |
|------|----------|----------------|
| `health.json` | `GET /api/health` | All stacks online (`qvac: true`, `wallet: true`) |
| `qvac-status.json` | `GET /api/ai/status` | Model loaded locally, `noCloudDependency: true` |
| `qvac-analyze.json` | `POST /api/ai/analyze` | **`ranLocally: true`** — judged QVAC proof |
| `qvac-predict.json` | `POST /api/ai/predict` | Outcome prediction, also local |
| `wallet-balance.json` | `GET /api/wallet/balance` | WDK Sepolia wallet + USDt |
| `p2p-room.json` | `POST /api/rooms/join` | Hyperswarm topic hash, `p2p: true` |
| `matches-live.json` | `GET /api/matches/live` | 12 WC26 fixtures |

**Last captured:** see timestamp in `LATEST.txt`.
