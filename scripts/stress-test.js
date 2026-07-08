#!/usr/bin/env node
/**
 * KICKOFF stress test — exercises every API route.
 * Run with API up: npm run stress (from repo root)
 */

const BASE = process.env.API_BASE || "http://127.0.0.1:3001";

async function req(method, path, body) {
  const started = Date.now();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text.slice(0, 500) };
  }
  return { status: res.status, json, ms: Date.now() - started };
}

function ok(name, r, expectStatus = 200) {
  const pass = r.status === expectStatus;
  console.log(
    pass ? "✓" : "✗",
    name,
    r.status,
    `${r.ms}ms`,
    pass ? "" : JSON.stringify(r.json).slice(0, 120),
  );
  return pass;
}

async function waitForReady(maxMs = 120_000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const h = await req("GET", "/api/health");
    const ai = await req("GET", "/api/ai/status");
    if (h.json?.qvac && h.json?.wallet && ai.json?.ready) return true;
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

async function main() {
  const failures = [];
  const check = (name, pass) => {
    if (!pass) failures.push(name);
  };

  console.log("=== WAITING FOR BOOT ===");
  const ready = await waitForReady();
  check("boot complete", ready);
  if (!ready) console.warn("Continuing — some tests may fail");

  console.log("\n=== HEALTH ===");
  const health = await req("GET", "/api/health");
  check("health", ok("GET /api/health", health));
  check("qvac ready", health.json?.qvac === true);
  check("wallet ready", health.json?.wallet === true);

  console.log("\n=== LIVE MATCHES ===");
  const liveStatus = await req("GET", "/api/matches/status");
  check("matches/status", ok("GET /api/matches/status", liveStatus));
  const liveList = await req("GET", "/api/matches/live");
  check("matches/live", ok("GET /api/matches/live", liveList));
  check(
    "matches array",
    Array.isArray(liveList.json?.matches) && liveList.json.matches.length > 0,
  );
  const liveOne = await req("GET", "/api/matches/live/can-mar");
  check("matches/live/:id", ok("GET /api/matches/live/can-mar", liveOne));
  const refresh = await req("POST", "/api/matches/refresh");
  check("matches/refresh", ok("POST /api/matches/refresh", refresh));

  console.log("\n=== QVAC AI ===");
  const aiStatus = await req("GET", "/api/ai/status");
  check("ai/status", ok("GET /api/ai/status", aiStatus));
  check("ai ready", aiStatus.json?.ready === true);

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
  check("ai/analyze", ok("POST /api/ai/analyze", analyze));
  check("ran locally", analyze.json?.ranLocally === true);

  const predict = await req("POST", "/api/ai/predict", {
    homeTeam: "Brazil",
    awayTeam: "England",
    context: "Quarter-final",
  });
  check("ai/predict", ok("POST /api/ai/predict", predict));

  console.log("\n=== P2P ROOMS ===");
  const room = await req("POST", "/api/rooms/join", {
    matchName: "France-Paraguay-R16",
  });
  check("rooms/join", ok("POST /api/rooms/join", room));

  const msg = await req("POST", "/api/rooms/message", {
    matchName: "France-Paraguay-R16",
    text: "Stress test message",
    aiAnalysis: analyze.json,
  });
  check("rooms/message", ok("POST /api/rooms/message", msg));

  const msgs = await req("GET", "/api/rooms/France-Paraguay-R16/messages");
  check("rooms/messages", ok("GET /api/rooms/.../messages", msgs));
  check(
    "has messages",
    Array.isArray(msgs.json?.messages) && msgs.json.messages.length > 0,
  );

  console.log("\n=== WDK WALLET ===");
  const balance = await req("GET", "/api/wallet/balance");
  check("wallet/balance", ok("GET /api/wallet/balance", balance));
  const address = await req("GET", "/api/wallet/address");
  check("wallet/address", ok("GET /api/wallet/address", address));
  const addr = address.json?.address;

  const tip = await req("POST", "/api/wallet/tip", {
    recipientAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    amountUsdt: 0.001,
    note: "stress test",
  });
  const tipOk = tip.status === 200 && tip.json?.txHash;
  const tipNoFunds =
    tip.status === 400 &&
    String(tip.json?.error || "").includes("insufficient");
  check(
    "wallet/tip",
    ok("POST /api/wallet/tip", tip, tipOk ? 200 : 400) &&
      (tipOk || tipNoFunds),
  );
  if (tipOk) console.log("  txHash:", tip.json.txHash);

  console.log("\n=== POOLS ===");
  const pool = await req("POST", "/api/pools/create", {
    matchName: "Canada-Morocco-R16",
    stakeUsdt: 1,
  });
  check("pools/create", ok("POST /api/pools/create", pool));
  const poolId = pool.json?.id;

  const pools = await req("GET", "/api/pools");
  check("pools/list", ok("GET /api/pools", pools));

  if (poolId && addr) {
    const join = await req("POST", `/api/pools/${poolId}/join`, {
      prediction: { homeGoals: 1, awayGoals: 1 },
      fanWalletAddress: addr,
    });
    check("pools/join", ok("POST /api/pools/:id/join", join));

    const confirm = await req("POST", `/api/pools/${poolId}/confirm`, {
      fanWalletAddress: addr,
      txHash: "0x" + "ab".repeat(32),
    });
    check("pools/confirm", ok("POST /api/pools/:id/confirm", confirm));

    const settle = await req("POST", `/api/pools/${poolId}/settle`, {
      actualResult: { homeGoals: 1, awayGoals: 1 },
    });
    const settleOk = settle.status === 200;
    const settleNoFunds =
      settle.status >= 400 &&
      String(settle.json?.error || "").match(/insufficient|funds/i);
    check(
      "pools/settle",
      (settleOk || settleNoFunds) &&
        ok("POST /api/pools/:id/settle", settle, settleOk ? 200 : settle.status),
    );
  }

  console.log("\n=== SUMMARY ===");
  if (failures.length) {
    console.error("FAILED:", failures.join(", "));
    process.exit(1);
  }
  console.log(`ALL ${failures.length === 0 ? "PASSED" : ""} — stress OK`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
