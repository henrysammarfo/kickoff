import { Router } from "express";
import {
  TipRequestSchema,
} from "../schemas.js";

export function createWalletRouter({ wallet, tipper }) {
  const router = Router();

  router.get("/balance", async (_req, res) => {
    try {
      const balance = await wallet.getBalance();
      res.json(balance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/address", async (_req, res) => {
    try {
      res.json({ address: await wallet.getAddressAsync() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/tip", async (req, res) => {
    try {
      const parsed = TipRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const { recipientAddress, amountUsdt, note } = parsed.data;
      const result = await tipper.tip(
        recipientAddress,
        parseFloat(String(amountUsdt)),
        note,
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
