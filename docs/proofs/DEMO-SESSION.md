# Live demo proofs — @henrysammarfo session (Jul 8 2026)

On-chain and QVAC evidence from the **recorded demo** and live testing on Sepolia testnet.

## WDK wallet

| | |
|---|---|
| **Address** | `0x64998cb8F2c9a6A9293c47c24Bf4535E003e57d3` |
| **Etherscan** | https://sepolia.etherscan.io/address/0x64998cb8F2c9a6A9293c47c24Bf4535E003e57d3 |
| **Network** | Sepolia |
| **USDt contract** | `0xd077A400968890Eacc75cdc901F0356c943e4fDb` (Crypto Chief faucet) |
| **USDt balance** | 100 → **99.98 USDt** after demo tips (on-chain proof of sends) |
| **ETH (gas)** | ~0.05 ETH funded · ~0.049 ETH remaining |

Token holdings: https://sepolia.etherscan.io/token/0xd077A400968890Eacc75cdc901F0356c943e4fDb?a=0x64998cb8F2c9a6A9293c47c24Bf4535E003e57d3

## On-chain transactions (USDt tips)

Both tips sent from the demo wallet via `POST /api/wallet/tip` (WDK self-custodial):

| # | Amount | Time (UTC) | Etherscan |
|---|--------|------------|-----------|
| 1 | **0.01 USDt** | Jul 8, 22:48 | https://sepolia.etherscan.io/tx/0xed0df1529a1bebbf5c7fbe22ec5e59dde30a63e7daa6510ab8b5bfcc8d02338e |
| 2 | **0.01 USDt** | Jul 8, 22:52 | https://sepolia.etherscan.io/tx/0xfeffc5d336bd164e5e278840df7636b2a8b54318f48f7610ee2f93937711d738 |

Recipient (test): `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

Wallet also shows **6 total Sepolia txs** (ETH funding + gas for tips). Full history on Etherscan address page above.

## QVAC — analyses run during demo

All returned **`ranLocally: true`** · **`deviceInference: true`** · model **`LLAMA_3_2_1B_INST_Q4_0`**

### France vs Morocco (QF) — `/matches/mar-fra`

```json
{
  "ranLocally": true,
  "processingTimeMs": 3026,
  "confidence": 85,
  "analysis": "France's dominance of possession is a concern, with Morocco's solidity in midfield forcing them back…",
  "message": "Analysis generated locally — zero cloud, zero API calls"
}
```

Full JSON: [qvac-france-morocco-qf.json](./demo-session/qvac-france-morocco-qf.json)

### Norway vs England (QF) — `/matches/nor-eng`

```json
{
  "ranLocally": true,
  "processingTimeMs": 1912,
  "confidence": 90,
  "analysis": "England's midfield dominance is yielding precious possession, but Norway's midfielders are starting to take control…",
  "prediction": "Norway 2-1 England - Haaland's pace will be too much for England to handle…"
}
```

Full JSON: [qvac-norway-england-qf.json](./demo-session/qvac-norway-england-qf.json)

### France vs Paraguay (R16 recap) — `/matches/fra-par`

```json
{
  "ranLocally": true,
  "processingTimeMs": 1608,
  "confidence": 75,
  "analysis": "France's victory hinges on maintaining possession and creating scoring opportunities with their superior midfield control."
}
```

Full JSON: [qvac-france-paraguay-r16.json](./demo-session/qvac-france-paraguay-r16.json)

### QVAC status at demo time

```json
{
  "ready": true,
  "runningLocally": true,
  "noCloudDependency": true,
  "model": "LLAMA_3_2_1B_INST_Q4_0",
  "runtime": { "cacheDirectory": "~/.qvac/models", "httpUrl": null }
}
```

Full JSON: [qvac-status.json](./demo-session/qvac-status.json)

## Pears — P2P room joined

| | |
|---|---|
| **Match** | France-Morocco-QF |
| **Hyperswarm topic** | `7176a8186ec2acd100e6022d511101934cb583a1a7a2ecb2c2711a3a2c288b48` |
| **Proof** | `p2p: true` on `POST /api/rooms/join` |

## Demo video

Paste YouTube link here after upload:

```
https://youtu.be/...
```

## Reproduce

```bash
cd api && npm run dev          # wait for [QVAC] Model loaded locally
npm run dev                    # http://localhost:3002
```

Open a match room → **Analyze** → **Send tip** → check tx on Sepolia Etherscan.
