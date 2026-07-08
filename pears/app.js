/**
 * KICKOFF Pear app entry — Hyperswarm match rooms
 * Run: pear run .  (from pears/)
 */

import { KickoffRoom } from "./p2p/room.js";

const matchName = process.env.KICKOFF_MATCH || "France-Morocco-QF";
const room = new KickoffRoom(matchName);

room.onMessage((peerId, msg) => {
  console.log(`[${peerId}]`, JSON.stringify(msg));
});

const info = await room.join();
console.log("KICKOFF Pear room joined:", info);

process.on("SIGINT", async () => {
  await room.leave();
  process.exit(0);
});
