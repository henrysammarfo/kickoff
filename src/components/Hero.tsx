import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useHealth, useLiveMatches } from "@/hooks/use-kickoff";
import { partitionMatches } from "@/lib/match-live";

export function Hero() {
  const { data: health } = useHealth();
  const { data: live } = useLiveMatches();
  const { liveNow } = partitionMatches(live?.matches ?? []);
  const liveCount = liveNow.length;
  const nextLive = liveNow[0];

  const statusLabel =
    liveCount > 0
      ? `${liveCount} live · World Cup 2026`
      : health?.status === "ok"
        ? `API online · World Cup 2026`
        : "World Cup 2026";

  return (
    <section className="relative grid min-h-screen grid-cols-4 gap-6 px-6 pb-16 pt-32 md:grid-cols-12 md:px-12 md:pb-24">
      <div className="col-span-4 flex items-end md:col-span-8 lg:col-span-7">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#A0A0A0]">
            <span className={`h-2 w-2 rounded-full ${liveCount > 0 || health?.status === "ok" ? "bg-[#C6FF3D]" : "bg-amber-400"}`} />
            {statusLabel}
          </div>
          <h1
            className="mt-6 font-display leading-[0.95] tracking-tight text-white"
            style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
          >
            Football,<br />without the<br /><em className="italic text-[#C6FF3D]">middlemen</em>.
          </h1>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-[#A0A0A0] md:text-lg">
            KICKOFF is a peer-to-peer fan platform. Local AI analyses every match on your device. Tip your friends in USDt. No servers. No custody. No permission needed.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/matches"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-all hover:bg-[#C6FF3D]"
            >
              {liveCount > 0 ? "Join a live room" : "Browse matches"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>
            <Link
              to="/how-it-works"
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-white underline-offset-4 hover:underline"
            >
              How it works →
            </Link>
            <Link
              to="/dashboard"
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C6FF3D] underline-offset-4 hover:underline"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </div>
      <div className="col-span-4 hidden items-end justify-end font-mono text-[10px] uppercase tracking-[0.25em] text-[#A0A0A0] md:col-span-4 lg:col-span-5 lg:flex">
        <div className="text-right">
          <p>N° 001 · KICKOFF</p>
          {nextLive ? (
            <p>
              {nextLive.home} {nextLive.score} {nextLive.away} · {nextLive.minute}
            </p>
          ) : (
            <p>MetLife · Jul 19 · 2026</p>
          )}
        </div>
      </div>
    </section>
  );
}
