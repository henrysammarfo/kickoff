import { Router } from "express";
import { MatchAnalysisRequestSchema, MatchPredictionRequestSchema } from "../schemas.js";

export function createAiRouter(ai) {
  const router = Router();

  router.get("/status", (_req, res) => {
    res.json(ai.getStatus());
  });

  router.post("/analyze", async (req, res) => {
    try {
      const parsed = MatchAnalysisRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      if (!ai.isReady()) {
        return res.status(503).json({ error: "QVAC model still loading..." });
      }

      const data = parsed.data;
      const result = await ai.analyzeMatch({
        ...data,
        minute: String(data.minute),
        homePossession: Number(data.homePossession),
        homeShots: Number(data.homeShots),
        awayShots: Number(data.awayShots),
      });

      res.json({
        ...result,
        message: "Analysis generated locally — zero cloud, zero API calls",
        deviceInference: result.deviceInference !== false,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/predict", async (req, res) => {
    try {
      const parsed = MatchPredictionRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const { homeTeam, awayTeam, context } = parsed.data;
      const result = await ai.predictMatch(homeTeam, awayTeam, context);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
