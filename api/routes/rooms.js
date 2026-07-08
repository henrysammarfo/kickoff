import { Router } from "express";
import b4a from "b4a";
import { KickoffRoom } from "../../pears/p2p/room.js";
import {
  RoomJoinRequestSchema,
  RoomMessageRequestSchema,
} from "../schemas.js";

export function createRoomsRouter(getRooms, getRoomMessages) {
  const router = Router();

  router.post("/join", async (req, res) => {
    try {
      const parsed = RoomJoinRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const { matchName } = parsed.data;
      const rooms = getRooms();
      const roomMessages = getRoomMessages();

      if (!rooms.has(matchName)) {
        const room = new KickoffRoom(matchName);

        room.onMessage((_peerId, msg) => {
          const msgs = roomMessages.get(matchName) || [];
          msgs.push(msg);
          if (msgs.length > 200) msgs.shift();
          roomMessages.set(matchName, msgs);
        });

        await room.join();
        rooms.set(matchName, room);
      }

      const room = rooms.get(matchName);
      res.json({
        matchName,
        peers: room.getPeerCount(),
        topic: b4a.toString(room.topic, "hex"),
        peerId: room.localPeerId,
        p2p: true,
        noServer:
          "Chat syncs over Hyperswarm P2P — this API only bootstraps the local peer.",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/message", async (req, res) => {
    try {
      const parsed = RoomMessageRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const { matchName, text, aiAnalysis } = parsed.data;
      const room = getRooms().get(matchName);
      if (!room) {
        return res.status(404).json({ error: "Room not found — join first" });
      }

      room.sendMessage(text, aiAnalysis);

      const roomMessages = getRoomMessages();
      const msgs = roomMessages.get(matchName) || [];
      msgs.push({
        type: "chat",
        peerId: room.localPeerId,
        text,
        aiAnalysis,
        timestamp: Date.now(),
        local: true,
      });
      roomMessages.set(matchName, msgs);

      res.json({ sent: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/:matchName/messages", (req, res) => {
    const msgs = getRoomMessages().get(req.params.matchName) || [];
    res.json({ messages: msgs });
  });

  return router;
}
