import { Router } from "express";
import {
  CreatePoolRequestSchema,
  JoinPoolRequestSchema,
  SettlePoolRequestSchema,
} from "../schemas.js";

export function createPoolsRouter(pool) {
  const router = Router();

  router.post("/create", (req, res) => {
    try {
      const parsed = CreatePoolRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const { matchName, stakeUsdt } = parsed.data;
      const newPool = pool.createPool({
        matchName,
        stakeUsdt: parseFloat(String(stakeUsdt)),
      });
      res.json(newPool);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/", (_req, res) => {
    res.json({ pools: pool.getAllPools() });
  });

  router.post("/:poolId/join", async (req, res) => {
    try {
      const parsed = JoinPoolRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const { prediction, fanWalletAddress, txHash } = parsed.data;
      const result = await pool.joinPool(
        req.params.poolId,
        prediction,
        fanWalletAddress,
        txHash,
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post("/:poolId/confirm", (req, res) => {
    try {
      const { fanWalletAddress, txHash } = req.body;
      const entry = pool.confirmPayment(
        req.params.poolId,
        fanWalletAddress,
        txHash,
      );
      res.json(entry);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post("/:poolId/settle", async (req, res) => {
    try {
      const parsed = SettlePoolRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const settled = await pool.settlePool(
        req.params.poolId,
        parsed.data.actualResult,
      );
      res.json(settled);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
