/**
 * TinyFish client — live match data ingestion (NOT for AI inference).
 * Docs: https://docs.tinyfish.ai
 *
 * Search + Fetch are free. Agent uses credits but returns structured JSON.
 */

const FETCH_URL = "https://api.fetch.tinyfish.ai";
const SEARCH_URL = "https://api.search.tinyfish.ai";
const AGENT_URL = "https://agent.tinyfish.ai/v1/automation/run";

const LIVE_MATCH_SCHEMA = {
  type: "object",
  properties: {
    matches: {
      type: "array",
      items: {
        type: "object",
        properties: {
          homeTeam: { type: "string" },
          awayTeam: { type: "string" },
          score: { type: "string" },
          minute: { type: "string", nullable: true },
          status: {
            type: "string",
            enum: ["live", "upcoming", "finished", "halftime"],
          },
          homePossession: { type: "integer", nullable: true },
          homeShots: { type: "integer", nullable: true },
          awayShots: { type: "integer", nullable: true },
          venue: { type: "string", nullable: true },
          recentEvents: {
            type: "array",
            items: { type: "string" },
            maxItems: 8,
          },
        },
        required: ["homeTeam", "awayTeam", "score", "status"],
      },
    },
  },
  required: ["matches"],
};

export class TinyFishClient {
  constructor() {
    this.apiKey = process.env.TINYFISH_API_KEY || "";
  }

  isConfigured() {
    return Boolean(this.apiKey);
  }

  async search(query, opts = {}) {
    const params = new URLSearchParams({
      query,
      location: opts.location || "US",
      language: opts.language || "en",
    });
    if (opts.recencyMinutes) {
      params.set("recency_minutes", String(opts.recencyMinutes));
    }
    if (opts.domainType) {
      params.set("domain_type", opts.domainType);
    }

    const res = await fetch(`${SEARCH_URL}?${params}`, {
      headers: { "X-API-Key": this.apiKey },
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`TinyFish Search ${res.status}: ${text.slice(0, 200)}`);
    }

    return res.json();
  }

  async fetchUrls(urls, { ttl = 0, format = "markdown" } = {}) {
    const res = await fetch(FETCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: JSON.stringify({ urls, ttl, format }),
      signal: AbortSignal.timeout(45_000),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`TinyFish Fetch ${res.status}: ${text.slice(0, 200)}`);
    }

    return res.json();
  }

  async agentExtractLiveMatches() {
    const targetUrl =
      process.env.TINYFISH_LIVE_URL ||
      "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026";

    const res = await fetch(AGENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: JSON.stringify({
        url: targetUrl,
        goal:
          "Extract all FIFA World Cup 2026 matches currently live or scheduled today. " +
          "Include home team, away team, score, match minute if live, status, shots and possession if visible.",
        output_schema: LIVE_MATCH_SCHEMA,
        browser_profile: "lite",
      }),
      signal: AbortSignal.timeout(120_000),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`TinyFish Agent ${res.status}: ${text.slice(0, 300)}`);
    }

    const data = await res.json();
    const result = data.result ?? data.output ?? data;
    if (result?.matches) return result.matches;
    if (typeof result === "string") {
      try {
        const parsed = JSON.parse(result);
        return parsed.matches ?? [];
      } catch {
        return [];
      }
    }
    return [];
  }

  /**
   * Tiered pipeline: Agent (structured) → Search+Fetch fallback → empty
   */
  async pullLiveMatches() {
    if (!this.isConfigured()) {
      return { matches: [], source: "unconfigured", error: "TINYFISH_API_KEY not set" };
    }

    const useAgent = process.env.TINYFISH_USE_AGENT !== "0";

    if (useAgent) {
      try {
        const matches = await this.agentExtractLiveMatches();
        if (matches.length > 0) {
          return { matches, source: "tinyfish-agent" };
        }
      } catch (err) {
        console.warn("[TinyFish] Agent failed, trying Search+Fetch:", err.message);
      }
    }

    try {
      const search = await this.search(
        "FIFA World Cup 2026 live scores today",
        { recencyMinutes: 120, domainType: "news" },
      );
      const urls = (search.results ?? [])
        .slice(0, 3)
        .map((r) => r.url)
        .filter(Boolean);

      if (urls.length === 0) {
        return { matches: [], source: "tinyfish-search-empty" };
      }

      const fetched = await this.fetchUrls(urls, { ttl: 0 });
      const texts = (fetched.results ?? fetched.data ?? [])
        .map((r) => r.text || r.content || "")
        .join("\n");

      const parsed = parseMatchesFromText(texts);
      return {
        matches: parsed,
        source: parsed.length ? "tinyfish-fetch" : "tinyfish-fetch-empty",
        fetchedUrls: urls,
      };
    } catch (err) {
      return { matches: [], source: "tinyfish-error", error: err.message };
    }
  }
}

/** Heuristic parser for fetch markdown — backup when Agent unavailable */
export function parseMatchesFromText(text) {
  const matches = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const live = line.match(
      /([A-Za-z][A-Za-z\s]{2,20}?)\s+(\d+)\s*[-–]\s*(\d+)\s+([A-Za-z][A-Za-z\s]{2,20}?)(?:\s+(\d+)'?)?/i,
    );
    if (live) {
      matches.push({
        homeTeam: live[1].trim(),
        awayTeam: live[4].trim(),
        score: `${live[2]} - ${live[3]}`,
        minute: live[5] ? `${live[5]}'` : null,
        status: live[5] ? "live" : "finished",
        homePossession: null,
        homeShots: null,
        awayShots: null,
        recentEvents: [],
      });
    }
  }

  return dedupeMatches(matches).slice(0, 12);
}

function dedupeMatches(matches) {
  const seen = new Set();
  return matches.filter((m) => {
    const key = `${m.homeTeam}-${m.awayTeam}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
