import { Router } from "express";

export function createMatchesRouter(liveMatches) {
  const router = Router();

  router.get("/status", (_req, res) => {
    res.json(liveMatches.getStatus());
  });

  router.get("/live", async (_req, res) => {
    try {
      const data = await liveMatches.listMatches();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/live/:id", async (req, res) => {
    try {
      const data = await liveMatches.getMatch(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/refresh", async (_req, res) => {
    try {
      const data = await liveMatches.refresh(true);
      res.json({
        refreshed: true,
        source: data.source,
        matchCount: data.matches.length,
        fetchedAt: data.fetchedAt,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
