#!/usr/bin/env node
/**
 * Capture live API proofs for judges / README.
 * Run with API up: npm run api:proofs
 */

import { mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.API_BASE || "http://127.0.0.1:3001";
const OUT = join(process.cwd(), "docs/proofs");

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

function save(name, data) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(data, null, 2));
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const ts = new Date().toISOString();
  const log = [`=== KICKOFF LIVE PROOFS ${ts} ===`, ""];

  console.log("Capturing proofs from", BASE);

  const health = await req("GET", "/api/health");
  save("health", health.json);
  log.push("health:", JSON.stringify(health.json, null, 2));
  console.log("✓ health", health.json?.status, "| qvac:", health.json?.qvac);

  const aiStatus = await req("GET", "/api/ai/status");
  save("qvac-status", aiStatus.json);
  log.push("\nqvac-status:", JSON.stringify(aiStatus.json, null, 2));
  console.log(
    "✓ qvac",
    aiStatus.json?.ready,
    "| runningLocally:",
    aiStatus.json?.runningLocally,
  );

  const analyze = await req("POST", "/api/ai/analyze", {
    homeTeam: "France",
    awayTeam: "Morocco",
    score: "0-0",
    minute: 12,
    homePossession: 58,
    homeShots: 3,
    awayShots: 1,
    recentEvents: ["Yellow card 8'"],
  });
  save("qvac-analyze", analyze.json);
  log.push("\nqvac-analyze:", JSON.stringify(analyze.json, null, 2));
  console.log(
    "✓ analyze ranLocally:",
    analyze.json?.ranLocally,
    "|",
    analyze.json?.processingTimeMs + "ms",
  );

  const predict = await req("POST", "/api/ai/predict", {
    homeTeam: "Norway",
    awayTeam: "England",
    context: "World Cup 2026 quarter-final",
  });
  save("qvac-predict", predict.json);
  log.push("\nqvac-predict:", JSON.stringify(predict.json, null, 2));
  console.log("✓ predict ranLocally:", predict.json?.ranLocally);

  const balance = await req("GET", "/api/wallet/balance");
  save("wallet-balance", balance.json);
  log.push("\nwallet-balance:", JSON.stringify(balance.json, null, 2));
  console.log("✓ wallet", balance.json?.address?.slice(0, 10) + "…");

  const room = await req("POST", "/api/rooms/join", {
    matchName: "France-Morocco-QF",
  });
  save("p2p-room", room.json);
  log.push("\np2p-room:", JSON.stringify(room.json, null, 2));
  console.log("✓ p2p topic", room.json?.topic?.slice(0, 16) + "…");

  const live = await req("GET", "/api/matches/live");
  save("matches-live", live.json);
  const qf = (live.json?.matches ?? []).filter((m) => m.stage === "QF");
  log.push("\nmatches QF:", qf.map((m) => `${m.home} vs ${m.away}`).join(", "));
  console.log("✓ fixtures", live.json?.matches?.length, "matches");

  writeFileSync(join(OUT, "LATEST.txt"), log.join("\n"));
  console.log("\nSaved to docs/proofs/*.json");
  console.log("QVAC proof flags:", {
    ready: aiStatus.json?.ready,
    runningLocally: aiStatus.json?.runningLocally,
    noCloudDependency: aiStatus.json?.noCloudDependency,
    ranLocally: analyze.json?.ranLocally,
    deviceInference: analyze.json?.deviceInference,
    modelCache: aiStatus.json?.runtime?.cacheDirectory,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
