import { Link } from "@tanstack/react-router";
import {
  useHealth,
  useLiveMatches,
  useLiveDataStatus,
  useAiStatus,
} from "@/hooks/use-kickoff";
import { ApiBanner } from "./ApiBanner";
import { ArrowRight, Radio } from "lucide-react";

/** Live stack + match strip for landing — no static fixture mocks. */
export function LandingLiveStatus() {
  const { data: health } = useHealth();
  const { data: live } = useLiveMatches();
  const { data: liveStatus } = useLiveDataStatus();
  const { data: ai } = useAiStatus();

  const matches = live?.matches ?? [];
  const liveCount = matches.filter((m) => m.status === "live").length;
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
            {health?.status === "ok" ? "API online" : "API connecting…"}
            {health?.teamNation ? ` · ${health.teamNation} 🇬🇭` : null}
          </span>
          <span className="text-[#A0A0A0]">
            QVAC {ai?.ready ? "ready" : "loading"} · WDK{" "}
            {health?.wallet ? "online" : "offline"} · {health?.activeRooms ?? 0}{" "}
            room{(health?.activeRooms ?? 0) === 1 ? "" : "s"}
          </span>
          <span className="text-[#C6FF3D]">
            {liveCount > 0 ? `${liveCount} live` : `${matches.length} matches`} ·{" "}
            {source !== "fixtures" ? `scores via ${source}` : "catalog loaded"}
          </span>
        </div>
      </div>
    </>
  );
}

export function LandingLiveMatches() {
  const { data: live, isLoading } = useLiveMatches();
  const matches = live?.matches ?? [];
  const preview = matches.slice(0, 4);

  if (isLoading && preview.length === 0) {
    return (
      <section className="relative px-6 md:px-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
          // live · wc26
        </p>
        <p className="mt-4 text-sm text-[#A0A0A0]">Loading matches from API…</p>
      </section>
    );
  }

  if (preview.length === 0) return null;

  return (
    <section className="relative grid grid-cols-4 gap-6 px-6 md:grid-cols-12 md:px-12">
      <div className="col-span-4 md:col-span-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
              // live · wc26
            </p>
            <h2 className="mt-4 font-display text-4xl text-white md:text-5xl">
              Matches right now.
            </h2>
          </div>
          <Link
            to="/matches"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D] hover:underline"
          >
            All matches <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10">
          {preview.map((m) => (
            <Link
              key={m.id}
              to="/matches/$matchId"
              params={{ matchId: m.id }}
              className="group flex flex-wrap items-center gap-3 bg-black p-4 transition-colors hover:bg-white/5 sm:p-5 md:grid md:grid-cols-12 md:gap-4"
            >
              <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] md:col-span-3">
                {m.status === "live" && (
                  <Radio className="h-3 w-3 text-[#C6FF3D]" strokeWidth={1.5} />
                )}
                <span className="truncate">
                  {m.stage} · {m.kickoff}
                </span>
              </div>
              <div className="flex min-w-0 flex-wrap items-center gap-2 md:col-span-7 md:gap-3">
                <span>{m.homeFlag}</span>
                <span className="font-display text-lg text-white">{m.home}</span>
                <span className="font-mono text-xs text-[#A0A0A0]">{m.score}</span>
                <span className="font-display text-lg text-white">{m.away}</span>
                <span>{m.awayFlag}</span>
                {m.status === "live" && (
                  <span className="rounded-full bg-[#C6FF3D]/10 px-2 py-0.5 font-mono text-[10px] text-[#C6FF3D]">
                    {m.minute}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0] md:col-span-2 md:text-right">
                Join room →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
