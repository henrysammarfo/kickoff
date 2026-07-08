/**
 * Live match data service — TinyFish ingestion merged with WC26 catalog.
 * QVAC never calls TinyFish; this layer feeds factual stats into analyze requests.
 */

import {
  FIXTURES_CATALOG,
  getCatalogFixture,
  matchRoomKey,
} from "../data/fixtures-catalog.js";
import { TinyFishClient } from "./tinyfish.js";

const CACHE_TTL_MS = Number(process.env.LIVE_DATA_CACHE_MS || 60_000);

let cache = {
  matches: null,
  source: "fixtures",
  fetchedAt: 0,
  meta: {},
};

function normalizeTeam(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function findCatalogMatch(homeTeam, awayTeam) {
  const h = normalizeTeam(homeTeam);
  const a = normalizeTeam(awayTeam);
  return FIXTURES_CATALOG.find((f) => {
    const fh = normalizeTeam(f.home);
    const fa = normalizeTeam(f.away);
    return (
      (fh.includes(h) || h.includes(fh)) && (fa.includes(a) || a.includes(fa))
    );
  });
}

function mergeLiveIntoCatalog(liveMatches, source, meta = {}) {
  const merged = FIXTURES_CATALOG.map((fixture) => ({ ...fixture }));

  for (const live of liveMatches) {
    const catalog = findCatalogMatch(live.homeTeam, live.awayTeam);
    if (!catalog) continue;

    const idx = merged.findIndex((m) => m.id === catalog.id);
    if (idx < 0) continue;

    const status =
      live.status === "live" || live.status === "halftime"
        ? "live"
        : live.status === "finished"
          ? "finished"
          : merged[idx].status;

    merged[idx] = {
      ...merged[idx],
      score: live.score || merged[idx].score,
      minute: live.minute || merged[idx].minute,
      status,
      homePossession:
        live.homePossession ?? merged[idx].homePossession,
      homeShots: live.homeShots ?? merged[idx].homeShots,
      awayShots: live.awayShots ?? merged[idx].awayShots,
      recentEvents:
        live.recentEvents?.length > 0
          ? live.recentEvents
          : merged[idx].recentEvents,
      venue: live.venue || merged[idx].venue,
      liveSource: source,
      updatedAt: Date.now(),
    };
  }

  return {
    matches: merged,
    source,
    fetchedAt: Date.now(),
    meta,
  };
}

export class LiveMatchesService {
  constructor() {
    this.tinyfish = new TinyFishClient();
  }

  isLiveDataEnabled() {
    return this.tinyfish.isConfigured();
  }

  getStatus() {
    return {
      tinyfishConfigured: this.tinyfish.isConfigured(),
      cacheAgeMs: cache.fetchedAt ? Date.now() - cache.fetchedAt : null,
      lastSource: cache.source,
      matchCount: (cache.matches ?? FIXTURES_CATALOG).length,
    };
  }

  async refresh(force = false) {
    if (
      !force &&
      cache.matches &&
      Date.now() - cache.fetchedAt < CACHE_TTL_MS
    ) {
      return cache;
    }

    if (!this.tinyfish.isConfigured()) {
      cache = {
        matches: FIXTURES_CATALOG.map((f) => ({ ...f, liveSource: "fixtures" })),
        source: "fixtures",
        fetchedAt: Date.now(),
        meta: { note: "Set TINYFISH_API_KEY for live web ingestion" },
      };
      return cache;
    }

    const pulled = await this.tinyfish.pullLiveMatches();
    cache = mergeLiveIntoCatalog(
      pulled.matches,
      pulled.source,
      { error: pulled.error, fetchedUrls: pulled.fetchedUrls },
    );
    return cache;
  }

  async listMatches() {
    const data = await this.refresh();
    return {
      matches: data.matches.map((m) => ({
        ...m,
        roomKey: matchRoomKey(m.home, m.away, m.stage),
      })),
      source: data.source,
      fetchedAt: data.fetchedAt,
      meta: data.meta,
    };
  }

  async getMatch(id) {
    const data = await this.refresh();
    const match =
      data.matches.find((m) => m.id === id) ?? getCatalogFixture(id);
    return {
      match: {
        ...match,
        roomKey: matchRoomKey(match.home, match.away, match.stage),
      },
      source: data.source,
      fetchedAt: data.fetchedAt,
    };
  }
}
