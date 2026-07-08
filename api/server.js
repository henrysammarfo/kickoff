/**
 * KICKOFF local API — QVAC + Hyperswarm + WDK
 * Frontend: http://localhost:3001/api
 */

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { FootballAI } from "./qvac/football-ai.js";
import { KickoffWallet } from "./wdk/wallet.js";
import { FanTipper } from "./wdk/tip.js";
import { PredictionPool } from "./wdk/pool.js";
import { createAiRouter } from "./routes/ai.js";
import { createRoomsRouter } from "./routes/rooms.js";
import { createWalletRouter } from "./routes/wallet.js";
import { createPoolsRouter } from "./routes/pools.js";
import { createMatchesRouter } from "./routes/matches.js";
import { LiveMatchesService } from "./services/live-matches.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || "127.0.0.1";

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
)
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, true); // local dev — permissive CORS
    },
  }),
);
app.use(express.json({ limit: "1mb" }));

const ai = new FootballAI();
const wallet = new KickoffWallet();
const liveMatches = new LiveMatchesService();
let tipper = null;
let poolMgr = null;
let poolsRouter = null;
const rooms = new Map();
const roomMessages = new Map();

let bootError = null;

async function boot() {
  try {
    await ai.initialize();
    await wallet.initialize();
    tipper = new FanTipper(wallet);
    poolMgr = new PredictionPool(wallet, tipper);
    poolsRouter = createPoolsRouter(poolMgr);
    console.log(`[KICKOFF] Backend ready | QVAC mode=${ai.mode}`);
    console.log(`[KICKOFF] Wallet ${await wallet.getAddressAsync()}`);
  } catch (err) {
    bootError = err;
    console.error("[KICKOFF] Startup error:", err);
  }
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: bootError ? "degraded" : "ok",
    error: bootError?.message || null,
    qvac: ai.isReady(),
    qvacMode: ai.mode,
    wallet: wallet.isReady(),
    activeRooms: rooms.size,
    liveData: liveMatches.isLiveDataEnabled(),
    liveDataStatus: liveMatches.getStatus(),
    teamNation: process.env.TEAM_NATION || "Ghana",
    description:
      "KICKOFF: Local AI + P2P + Self-custodial. All three Tether stacks.",
    stacks: {
      qvac: "on-device inference via @qvac/sdk",
      pears: "Hyperswarm P2P via Pears building blocks",
      wdk: "self-custodial @tetherto/wdk",
      liveIngest: "TinyFish web ingestion → local QVAC analysis",
    },
  });
});

app.use("/api/matches", createMatchesRouter(liveMatches));

app.use("/api/ai", createAiRouter(ai));
app.use(
  "/api/rooms",
  createRoomsRouter(() => rooms, () => roomMessages),
);
app.use(
  "/api/wallet",
  createWalletRouter({
    get wallet() {
      return wallet;
    },
    get tipper() {
      return tipper;
    },
  }),
);

app.use("/api/pools", (req, res, next) => {
  if (!poolsRouter) {
    return res.status(503).json({ error: "Wallet/pools not initialized" });
  }
  return poolsRouter(req, res, next);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`[KICKOFF] API http://${HOST}:${PORT}/api`);
});

boot();

process.on("SIGINT", async () => {
  for (const [, room] of rooms) await room.leave().catch(() => {});
  await ai.shutdown().catch(() => {});
  server.close(() => process.exit(0));
});

export default app;
