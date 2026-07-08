import { Link } from "@tanstack/react-router";
import { useLiveMatches, useRefreshLiveMatches } from "@/hooks/use-kickoff";
import {
  canJoinRoom,
  isLiveNow,
  matchActionLabel,
  partitionMatches,
} from "@/lib/match-live";
import type { LiveMatch } from "@/lib/api";
import { ApiBanner } from "./ApiBanner";
import { ArrowRight, Loader2, Radio, RefreshCw } from "lucide-react";
import { useHealth } from "@/hooks/use-kickoff";

function MatchRow({ m }: { m: LiveMatch }) {
  const live = isLiveNow(m);
  const action = matchActionLabel(m);

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
        {m.status === "finished" && (
          <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-[#A0A0A0]">
            FT
          </span>
        )}
      </div>
      <span
        className={`font-mono text-[10px] uppercase tracking-widest md:col-span-2 md:text-right ${canJoinRoom(m) ? "text-[#C6FF3D] group-hover:underline" : "text-[#A0A0A0]"}`}
      >
        {action} →
      </span>
    </Link>
  );
}

export function LandingLiveStatus() {
  const { data: health } = useHealth();
  const { data: live } = useLiveMatches();
  const { liveNow, upcoming, finished } = partitionMatches(live?.matches ?? []);

  if (health?.status !== "ok") {
    return (
      <>
        <ApiBanner />
        <div className="mx-auto max-w-7xl px-6 pt-24 md:px-12">
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
            Start API: cd api && npm run dev
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-24 md:px-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0]">
        <span className="text-[#C6FF3D]">●</span> API online · {liveNow.length}{" "}
        live · {upcoming.length} upcoming · {finished.length} finished · Ghana
        🇬🇭
      </p>
    </div>
  );
}

export function LandingLiveMatches() {
  const { data: live, isLoading, isError } = useLiveMatches();
  const refresh = useRefreshLiveMatches();
  const matches = live?.matches ?? [];
  const { liveNow, finished, upcoming } = partitionMatches(matches);
  const previewUpcoming = upcoming.slice(0, 4);

  return (
    <section className="relative grid grid-cols-4 gap-6 px-6 md:grid-cols-12 md:px-12">
      <div className="col-span-4 md:col-span-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
              // knockout · wc26
            </p>
            <h2 className="mt-4 font-display text-4xl text-white md:text-5xl">
              Quarter-finals ahead.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[#A0A0A0]">
              R16 results are final. Create or join a room on any upcoming QF
              fixture — first fan creates it, the next joins.
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
              Refresh
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
            <code className="text-amber-100">cd api && npm run dev</code>
          </p>
        )}

        {liveNow.length > 0 && (
          <div className="mb-8 grid gap-px overflow-hidden rounded-2xl bg-white/10">
            {liveNow.map((m) => (
              <MatchRow key={m.id} m={m} />
            ))}
          </div>
        )}

        {previewUpcoming.length > 0 && (
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
              Upcoming · quarter-finals
            </p>
            <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10">
              {previewUpcoming.map((m) => (
                <MatchRow key={m.id} m={m} />
              ))}
            </div>
          </div>
        )}

        {finished.length > 0 && (
          <div className="mt-10">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
              Finished · round of 16
            </p>
            <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10">
              {finished.slice(0, 2).map((m) => (
                <MatchRow key={m.id} m={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
