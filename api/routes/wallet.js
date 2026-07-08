import { Router } from "express";
import {
  TipRequestSchema,
} from "../schemas.js";

export function createWalletRouter(deps) {
  const router = Router();

  const getWallet = () =>
    typeof deps.wallet === "function" ? deps.wallet() : deps.wallet;
  const getTipper = () =>
    typeof deps.tipper === "function" ? deps.tipper() : deps.tipper;

  router.get("/balance", async (_req, res) => {
    try {
      const balance = await getWallet().getBalance();
      res.json(balance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/address", async (_req, res) => {
    try {
      res.json({ address: await getWallet().getAddressAsync() });
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

      const tipper = getTipper();
      if (!tipper) {
        return res.status(503).json({ error: "Wallet/tipper not initialized" });
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
