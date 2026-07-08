import { Link } from "@tanstack/react-router";
import {
  useHealth,
  useLiveMatches,
  useLiveDataStatus,
  useAiStatus,
  useRefreshLiveMatches,
} from "@/hooks/use-kickoff";
import { ApiBanner } from "./ApiBanner";
import { ArrowRight, Loader2, Radio, RefreshCw } from "lucide-react";
import type { LiveMatch } from "@/lib/api";
import {
  isLiveNow,
  liveSourceLabel,
  partitionMatches,
} from "@/lib/match-live";

function MatchRow({ m }: { m: LiveMatch }) {
  const live = isLiveNow(m);
  return (
    <Link
      to="/matches/$matchId"
      params={{ matchId: m.id }}
      className="group flex flex-wrap items-center gap-3 bg-black p-4 transition-colors hover:bg-white/5 sm:p-5 md:grid md:grid-cols-12 md:gap-4"
    >
      <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] md:col-span-3">
        {live ? (
          <Radio className="h-3 w-3 shrink-0 text-[#C6FF3D]" strokeWidth={1.5} />
        ) : null}
        <span className="truncate">
          {m.stage} · {m.kickoff}
        </span>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-2 md:col-span-7 md:gap-3">
        <span>{m.homeFlag}</span>
        <span className="font-display text-lg text-white">{m.home}</span>
        <span className="font-mono text-xs text-[#A0A0A0]">
          {m.score !== "—" ? m.score : "vs"}
        </span>
        <span className="font-display text-lg text-white">{m.away}</span>
        <span>{m.awayFlag}</span>
        {live && (
          <span className="rounded-full bg-[#C6FF3D]/10 px-2 py-0.5 font-mono text-[10px] text-[#C6FF3D]">
            LIVE {m.minute}
          </span>
        )}
        {!live && (
          <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[#A0A0A0]">
            Scheduled
          </span>
        )}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D] group-hover:underline md:col-span-2 md:text-right">
        Open room →
      </span>
    </Link>
  );
}

/** Live stack + match strip for landing — ingested scores only marked live. */
export function LandingLiveStatus() {
  const { data: health } = useHealth();
  const { data: live } = useLiveMatches();
  const { data: liveStatus } = useLiveDataStatus();
  const { data: ai } = useAiStatus();

  const { liveNow } = partitionMatches(live?.matches ?? []);
  const source = live?.source ?? liveStatus?.lastSource ?? "api";

  return (
    <>
      <ApiBanner />
      <div className="border-b border-white/10 bg-black/40 px-6 py-3 backdrop-blur-md md:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2 text-[#A0A0A0]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${health?.status === "ok" ? "bg-[#C6FF3D]" : "bg-amber-400"}`}
            />
            {health?.status === "ok" ? "API online" : "Start API — cd api && npm run dev"}
            {health?.teamNation ? ` · ${health.teamNation} 🇬🇭` : null}
          </span>
          <Link
            to="/dashboard"
            className="text-[#C6FF3D] hover:underline"
          >
            Dashboard →
          </Link>
          <span className="text-[#A0A0A0]">
            QVAC {ai?.ready ? "ready" : "loading"} · WDK{" "}
            {health?.wallet ? "online" : "offline"} · {liveNow.length} live ·{" "}
            {liveSourceLabel(source)}
          </span>
        </div>
      </div>
    </>
  );
}

export function LandingLiveMatches() {
  const { data: live, isLoading, isError } = useLiveMatches();
  const refresh = useRefreshLiveMatches();
  const matches = live?.matches ?? [];
  const { liveNow, upcoming } = partitionMatches(matches);
  const previewLive = liveNow.slice(0, 4);
  const previewUpcoming = upcoming.slice(0, 3);

  return (
    <section className="relative grid grid-cols-4 gap-6 px-6 md:grid-cols-12 md:px-12">
      <div className="col-span-4 md:col-span-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
              // live · wc26
            </p>
            <h2 className="mt-4 font-display text-4xl text-white md:text-5xl">
              {previewLive.length > 0 ? "Live right now." : "Pick a match room."}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[#A0A0A0]">
              Scores from TinyFish when available. Rooms always open — P2P chat,
              local AI, and USDt work even with 0 peers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => refresh.mutate()}
              disabled={refresh.isPending}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white hover:bg-white/5 disabled:opacity-50"
            >
              {refresh.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
              )}
              Refresh scores
            </button>
            <Link
              to="/matches"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D] hover:underline"
            >
              All matches <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        {isLoading && matches.length === 0 && (
          <p className="text-sm text-[#A0A0A0]">Loading from API…</p>
        )}
        {isError && (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Cannot reach API — run{" "}
            <code className="text-amber-100">cd api && npm run dev</code> then
            refresh.
          </p>
        )}

        {previewLive.length > 0 ? (
          <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10">
            {previewLive.map((m) => (
              <MatchRow key={m.id} m={m} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
              No live scores ingested yet · {liveSourceLabel(live?.source)}
            </p>
            <p className="mt-3 text-sm text-[#A0A0A0]">
              Tap refresh or open any scheduled fixture below — the room, AI, and
              wallet still work for your demo.
            </p>
          </div>
        )}

        {previewUpcoming.length > 0 && (
          <div className="mt-10">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
              Scheduled · WC26 catalog
            </p>
            <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10">
              {previewUpcoming.map((m) => (
                <MatchRow key={m.id} m={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
