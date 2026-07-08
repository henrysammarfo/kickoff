#!/usr/bin/env node
/**
 * Smoke test — run with API server up: npm run smoke (from api/)
 * Or: node scripts/smoke-test.js
 */

const BASE = process.env.API_BASE || "http://127.0.0.1:3001";

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

async function main() {
  const failures = [];

  const health = await req("GET", "/api/health");
  console.log("health", health.status, health.json);
  if (health.status !== 200) failures.push("health");

  const aiStatus = await req("GET", "/api/ai/status");
  console.log("ai/status", aiStatus.status, aiStatus.json);
  if (!aiStatus.json?.ready) failures.push("ai not ready");

  const analyze = await req("POST", "/api/ai/analyze", {
    homeTeam: "France",
    awayTeam: "Paraguay",
    score: "2-1",
    minute: 67,
    homePossession: 65,
    homeShots: 8,
    awayShots: 3,
    recentEvents: ["Yellow card 62'"],
  });
  console.log("ai/analyze", analyze.status, analyze.json?.analysis?.slice?.(0, 80));
  if (analyze.status !== 200) failures.push("analyze");

  const room = await req("POST", "/api/rooms/join", {
    matchName: "France-Paraguay-R16",
  });
  console.log("rooms/join", room.status, room.json);
  if (room.status !== 200) failures.push("room join");

  const msg = await req("POST", "/api/rooms/message", {
    matchName: "France-Paraguay-R16",
    text: "What a match!",
    aiAnalysis: analyze.json,
  });
  console.log("rooms/message", msg.status, msg.json);
  if (msg.status !== 200) failures.push("room message");

  const balance = await req("GET", "/api/wallet/balance");
  console.log("wallet/balance", balance.status, balance.json?.address);
  if (balance.status !== 200) failures.push("wallet balance");

  if (failures.length) {
    console.error("SMOKE FAILED:", failures.join(", "));
    process.exit(1);
  }
  console.log("SMOKE OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
