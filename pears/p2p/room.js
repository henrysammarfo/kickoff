/**
 * KICKOFF P2P Room Management using Hyperswarm
 */

import Hyperswarm from "hyperswarm";
import b4a from "b4a";
import crypto from "crypto";
import { randomUUID } from "crypto";
import { parseMessage } from "./messages.js";

export class KickoffRoom {
  constructor(matchName) {
    this.matchName = matchName;
    this.swarm = new Hyperswarm();
    this.peers = new Map();
    this.messageHandlers = [];
    this.localPeerId = randomUUID();

    this.topic = crypto.createHash("sha256").update(`kickoff:${matchName}`).digest();

    this._setupSwarm();
  }

  _setupSwarm() {
    this.swarm.on("connection", (conn, info) => {
      const peerId = b4a.toString(info.publicKey, "hex").slice(0, 8);
      this.peers.set(peerId, conn);

      this._send(conn, {
        type: "join",
        peerId: this.localPeerId,
        match: this.matchName,
        timestamp: Date.now(),
      });

      conn.on("data", (data) => {
        try {
          const msg = parseMessage(data);
          this._handleIncoming(peerId, msg);
        } catch (e) {
          console.error("Failed to parse peer message:", e.message);
        }
      });

      conn.on("close", () => {
        this.peers.delete(peerId);
      });

      conn.on("error", () => {
        this.peers.delete(peerId);
      });
    });
  }

  async join() {
    const discovery = this.swarm.join(this.topic, {
      client: true,
      server: true,
    });

    await discovery.flushed();

    return {
      room: this.matchName,
      topic: b4a.toString(this.topic, "hex"),
      peerId: this.localPeerId,
      peers: this.peers.size,
    };
  }

  broadcast(message) {
    const payload = JSON.stringify({
      ...message,
      peerId: message.peerId || this.localPeerId,
      timestamp: message.timestamp || Date.now(),
    });

    for (const [, conn] of this.peers) {
      try {
        conn.write(Buffer.from(payload));
      } catch (e) {
        console.error("Failed to send to peer:", e.message);
      }
    }
  }

  sendMessage(text, aiAnalysis = null) {
    this.broadcast({
      type: "chat",
      text,
      aiAnalysis,
      peerId: this.localPeerId,
    });
  }

  broadcastTip(recipientPeerId, amountUsdt, txHash) {
    this.broadcast({
      type: "tip",
      from: this.localPeerId,
      to: recipientPeerId,
      amount: amountUsdt,
      txHash,
      message: `Tipped ${amountUsdt} USDt`,
    });
  }

  broadcastPoolUpdate(poolId, action, entry = null) {
    this.broadcast({
      type: "pool",
      poolId,
      action,
      entry,
      peerId: this.localPeerId,
    });
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  _handleIncoming(peerId, msg) {
    for (const handler of this.messageHandlers) {
      handler(peerId, msg);
    }
  }

  _send(conn, msg) {
    conn.write(Buffer.from(JSON.stringify(msg)));
  }

  getPeerCount() {
    return this.peers.size;
  }

  async leave() {
    await this.swarm.destroy();
  }
}
