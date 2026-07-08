import type { LiveMatch } from "@/lib/api";

/** True when TinyFish (or other ingest) updated this row — not static catalog. */
export function isIngestedLive(m: LiveMatch): boolean {
  const src = m.liveSource ?? "";
  return (
    src.startsWith("tinyfish") &&
    src !== "tinyfish-fetch-empty" &&
    src !== "tinyfish-search-empty" &&
    src !== "tinyfish-unconfigured"
  );
}

export function isLiveNow(m: LiveMatch): boolean {
  return m.status === "live" && isIngestedLive(m);
}

export function partitionMatches(matches: LiveMatch[]) {
  const liveNow = matches.filter(isLiveNow);
  const upcoming = matches.filter((m) => !isLiveNow(m));
  return { liveNow, upcoming };
}

export function liveSourceLabel(source?: string): string {
  if (!source || source === "fixtures") return "WC26 catalog";
  if (source.includes("empty") || source.includes("error")) return "live fetch pending";
  return source.replace("tinyfish-", "TinyFish · ");
}
