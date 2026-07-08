/**
 * KICKOFF Pear UI — minimal in-app view for pear run
 */
import { KickoffRoom } from "./p2p/room.js";

const matchName = process.env.KICKOFF_MATCH || "France-Paraguay-R16";
const statusEl = document.getElementById("status");
const metaEl = document.getElementById("meta");
const logEl = document.getElementById("log");

function log(line, cls = "") {
  const p = document.createElement("p");
  if (cls) p.className = cls;
  p.textContent = line;
  logEl?.prepend(p);
}

const room = new KickoffRoom(matchName);

room.onMessage((peerId, msg) => {
  if (msg.type === "chat" && msg.text) {
    log(`[${peerId.slice(0, 8)}] ${msg.text}`, "peer");
  } else {
    log(`[${peerId.slice(0, 8)}] ${JSON.stringify(msg)}`);
  }
});

const info = await room.join();
statusEl.textContent = `Connected · ${info.peers} peer(s)`;
metaEl.textContent = `Room ${info.room} · topic ${info.topic.slice(0, 16)}…`;

log(`Joined as ${info.peerId}`);
log("P2P sync active — no central chat server");

process.on?.("SIGINT", async () => {
  await room.leave();
  process.exit(0);
});
