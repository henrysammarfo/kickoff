import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ApiBanner } from "@/components/ApiBanner";
import { useLiveMatches, useRefreshLiveMatches } from "@/hooks/use-kickoff";
import {
  canJoinRoom,
  isLiveNow,
  liveSourceLabel,
  matchActionLabel,
  partitionMatches,
} from "@/lib/match-live";
import type { LiveMatch } from "@/lib/api";
import { Loader2, Radio, RefreshCw, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/matches/")({
  head: () => ({
    meta: [
      { title: "Matches — KICKOFF" },
      {
        name: "description",
        content:
          "World Cup 2026 knockout fixtures — finished, live, and upcoming.",
      },
    ],
  }),
  component: MatchesIndex,
});

function MatchListRow({ m }: { m: LiveMatch }) {
  const live = isLiveNow(m);
  const action = matchActionLabel(m);

  return (
    <Link
      to="/matches/$matchId"
      params={{ matchId: m.id }}
      className="group flex flex-col gap-3 bg-black p-4 transition-colors hover:bg-white/5 sm:p-6 md:grid md:grid-cols-12 md:items-center md:gap-4"
    >
      <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#A0A0A0] md:col-span-3">
        {live && (
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C6FF3D]" />
        )}
        <span className="truncate">
          {m.stage} · {m.kickoff}
        </span>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 md:col-span-6 md:gap-4">
        <span className="text-xl sm:text-2xl">{m.homeFlag}</span>
        <span className="font-display text-xl text-white sm:text-2xl md:text-3xl">
          {m.home}
        </span>
        <span className="font-mono text-xs text-[#A0A0A0]">
          {m.score !== "—" ? m.score : "vs"}
        </span>
        <span className="font-display text-xl text-white sm:text-2xl md:text-3xl">
          {m.away}
        </span>
        <span className="text-xl sm:text-2xl">{m.awayFlag}</span>
        {live && (
          <span className="rounded-full bg-[#C6FF3D]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D]">
            {m.minute}
          </span>
        )}
        {m.status === "finished" && (
          <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
            FT
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 font-mono text-[11px] md:col-span-3 md:justify-end">
        <span
          className={`flex items-center gap-2 ${canJoinRoom(m) ? "text-[#C6FF3D] group-hover:underline" : "text-[#A0A0A0]"}`}
        >
          {action}
        </span>
        <ArrowRight
          className="h-4 w-4 text-white transition-transform group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      </div>
    </Link>
  );
}

function MatchSection({
  title,
  items,
}: {
  title: string;
  items: LiveMatch[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-10">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
        {title}
      </p>
      <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10">
        {items.map((m) => (
          <MatchListRow key={m.id} m={m} />
        ))}
      </div>
    </div>
  );
}

function MatchesIndex() {
  const { data: live, isLoading, isError } = useLiveMatches();
  const refresh = useRefreshLiveMatches();
  const matches = live?.matches ?? [];
  const { liveNow, finished, upcoming } = partitionMatches(matches);

  return (
    <PageShell
      eyebrow="// knockout · wc26"
      title="Every match. Every room."
      lede="Quarter-finals ahead. R16 results are final. Create or join a P2P room on any upcoming fixture."
    >
      <ApiBanner />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
          {liveSourceLabel(live?.source)} · {liveNow.length} live ·{" "}
          {upcoming.length} upcoming · {finished.length} finished
        </p>
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
          Refresh live scores
        </button>
      </div>

      {isLoading && matches.length === 0 && (
        <p className="mb-6 text-sm text-[#A0A0A0]">Loading matches…</p>
      )}
      {isError && (
        <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          API offline — run{" "}
          <code className="text-amber-100">cd api && npm run dev</code>
        </p>
      )}

      <MatchSection title="Live now · TinyFish" items={liveNow} />
      <MatchSection title="Upcoming · quarter-finals" items={upcoming} />
      <MatchSection title="Finished · round of 16" items={finished} />

      <div className="mt-4 flex items-center gap-3 text-sm text-[#A0A0A0]">
        <Radio className="h-4 w-4" strokeWidth={1.5} />
        First fan creates the room · next fans join the same Hyperswarm topic.
      </div>
    </PageShell>
  );
}
