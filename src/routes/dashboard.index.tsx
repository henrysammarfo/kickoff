import { createFileRoute, Link } from "@tanstack/react-router";
import type { ComponentType } from "react";
import {
  useWallet,
  useHealth,
  usePools,
  useAiStatus,
  useLiveMatches,
} from "@/hooks/use-kickoff";
import { partitionMatches } from "@/lib/match-live";
import { ArrowUpRight, TrendingUp, Wallet, Radio, Trophy } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashHome,
});

function DashHome() {
  const { data: wallet } = useWallet();
  const { data: health } = useHealth();
  const { data: pools } = usePools();
  const { data: ai } = useAiStatus();
  const { data: live } = useLiveMatches();

  const matches = live?.matches ?? [];
  const { liveNow } = partitionMatches(matches);
  const liveCount = liveNow.length;
  const openPools = pools?.filter((p) => p.status === "open").length ?? 0;

  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
          // overview
        </p>
        <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl md:text-6xl">
          Good evening.
        </h1>
        <p className="mt-3 text-[#A0A0A0]">
          {liveCount} match{liveCount === 1 ? "" : "es"} live ·{" "}
          {health?.activeRooms ?? 0} active room
          {(health?.activeRooms ?? 0) === 1 ? "" : "s"} ·{" "}
          {health?.teamNation ?? "Ghana"} 🇬🇭
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Wallet · USDt"
          value={(wallet?.usdt ?? 0).toFixed(2)}
          sub={wallet?.network ?? "WDK testnet"}
        />
        <StatCard
          icon={Radio}
          label="Active rooms"
          value={String(health?.activeRooms ?? 0)}
          sub={`${liveCount} live fixtures`}
        />
        <StatCard
          icon={Trophy}
          label="Open pools"
          value={String(openPools)}
          sub={`${pools?.length ?? 0} total`}
        />
        <StatCard
          icon={TrendingUp}
          label="Local AI"
          value={ai?.ready ? "Ready" : "Loading"}
          sub={ai?.model ?? "QVAC"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass min-w-0 overflow-hidden rounded-2xl p-4 sm:p-6 lg:col-span-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
              Live & upcoming
            </p>
            <Link
              to="/matches"
              className="font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D] hover:underline"
            >
              All matches →
            </Link>
          </div>
          <div className="space-y-4">
            {matches.slice(0, 4).map((m) => (
              <Link
                key={m.id}
                to="/matches/$matchId"
                params={{ matchId: m.id }}
                className="flex flex-col gap-2 border-b border-white/5 pb-4 last:border-0 hover:opacity-80 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3">
                  <span className="text-lg sm:text-xl">{m.homeFlag}</span>
                  <span className="truncate text-sm text-white sm:text-base">
                    {m.home}
                  </span>
                  <span className="font-mono text-xs text-[#A0A0A0]">
                    {m.score}
                  </span>
                  <span className="truncate text-sm text-white sm:text-base">
                    {m.away}
                  </span>
                  <span className="text-lg sm:text-xl">{m.awayFlag}</span>
                </div>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
                  {m.status === "live" ? `LIVE ${m.minute}` : m.kickoff}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
            Stack status
          </p>
          <div className="space-y-4 text-sm">
            <StatusRow label="API" ok={health?.status === "ok"} />
            <StatusRow label="QVAC" ok={health?.qvac} detail={health?.qvacMode} />
            <StatusRow label="WDK wallet" ok={health?.wallet} />
            <StatusRow
              label="P2P rooms"
              ok={(health?.activeRooms ?? 0) > 0}
              detail={`${health?.activeRooms ?? 0} joined`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="glass min-w-0 overflow-hidden rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-[#C6FF3D]" strokeWidth={1.75} />
        <ArrowUpRight className="h-3.5 w-3.5 text-[#A0A0A0]" strokeWidth={1.5} />
      </div>
      <p className="mt-4 truncate font-display text-2xl text-white sm:mt-6 sm:text-3xl md:text-4xl">
        {value}
      </p>
      <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.2em] text-[#A0A0A0] sm:text-[10px] sm:tracking-[0.25em]">
        {label}
      </p>
      <p className="mt-2 truncate text-xs text-[#A0A0A0] sm:mt-3">{sub}</p>
    </div>
  );
}

function StatusRow({
  label,
  ok,
  detail,
}: {
  label: string;
  ok?: boolean;
  detail?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-white">{label}</p>
        {detail && (
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
            {detail}
          </p>
        )}
      </div>
      <span
        className={`font-mono text-xs ${ok ? "text-[#C6FF3D]" : "text-amber-400"}`}
      >
        {ok ? "online" : "offline"}
      </span>
    </div>
  );
}
