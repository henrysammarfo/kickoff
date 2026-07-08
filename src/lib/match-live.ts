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

export function isFinished(m: LiveMatch): boolean {
  return m.status === "finished";
}

/** P2P rooms open for upcoming + ingested-live — not for completed ties. */
export function canJoinRoom(m: LiveMatch): boolean {
  return m.status === "upcoming" || isLiveNow(m);
}

export function partitionMatches(matches: LiveMatch[]) {
  const liveNow = matches.filter(isLiveNow);
  const finished = matches.filter(isFinished);
  const upcoming = matches.filter(
    (m) => m.status === "upcoming" && !isLiveNow(m),
  );
  return { liveNow, finished, upcoming };
}

export function liveSourceLabel(source?: string): string {
  if (!source || source === "fixtures") return "WC26 catalog";
  if (source.includes("empty") || source.includes("error"))
    return "live fetch pending";
  return source.replace("tinyfish-", "TinyFish · ");
}

export function matchActionLabel(m: LiveMatch): string {
  if (isFinished(m)) return "View recap";
  if (isLiveNow(m)) return "Join live room";
  return "Create / join room";
}
