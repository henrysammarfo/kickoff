/**
 * KICKOFF P2P message protocol
 */

export const MessageTypes = {
  JOIN: "join",
  CHAT: "chat",
  TIP: "tip",
  POOL: "pool",
};

export function createEnvelope(type, payload, peerId) {
  return {
    type,
    peerId,
    timestamp: Date.now(),
    ...payload,
  };
}

export function parseMessage(buffer) {
  const raw = typeof buffer === "string" ? buffer : buffer.toString();
  const msg = JSON.parse(raw);
  if (!msg.type || !msg.timestamp) {
    throw new Error("Invalid P2P message envelope");
  }
  return msg;
}
