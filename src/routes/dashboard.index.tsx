import { createFileRoute, Link } from "@tanstack/react-router";
import { WALLET, ROOMS, POOLS, MATCHES } from "@/lib/mock-data";
import { ArrowUpRight, TrendingUp, Wallet, Radio, Trophy } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashHome,
});

function DashHome() {
  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// overview</p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">Good evening.</h1>
        <p className="mt-3 text-[#A0A0A0]">Two matches live, {ROOMS.reduce((a, r) => a + r.peers, 0).toLocaleString()} peers online.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Wallet} label="Wallet · USDt" value={WALLET.balance.toFixed(2)} sub="+42 today" />
        <StatCard icon={Radio} label="Active rooms" value={String(ROOMS.length)} sub="3 unread" />
        <StatCard icon={Trophy} label="Open pools" value={String(POOLS.filter(p => p.status === "open").length)} sub="1 live" />
        <StatCard icon={TrendingUp} label="AI reads today" value="14" sub="Phi-3 Mini" />
      </div>

      {/* Live matches + activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">Live & upcoming</p>
            <Link to="/matches" className="font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D] hover:underline">All matches →</Link>
          </div>
          <div className="space-y-4">
            {MATCHES.slice(0, 4).map((m) => (
              <Link key={m.id} to="/matches/$matchId" params={{ matchId: m.id }} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 hover:opacity-80">
                <div className="flex items-center gap-4">
                  <span className="text-xl">{m.homeFlag}</span>
                  <span className="text-white">{m.home}</span>
                  <span className="font-mono text-xs text-[#A0A0A0]">{m.score}</span>
                  <span className="text-white">{m.away}</span>
                  <span className="text-xl">{m.awayFlag}</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">{m.status === "live" ? `LIVE ${m.minute}` : m.kickoff}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">Recent activity</p>
          <div className="space-y-4 text-sm">
            {WALLET.tx.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white">{t.note}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">{t.ts}</p>
                </div>
                <span className={`font-mono text-xs ${t.amount > 0 ? "text-[#C6FF3D]" : "text-white/70"}`}>
                  {t.amount > 0 ? "+" : ""}{t.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-[#C6FF3D]" strokeWidth={1.75} />
        <ArrowUpRight className="h-3.5 w-3.5 text-[#A0A0A0]" strokeWidth={1.5} />
      </div>
      <p className="mt-6 font-display text-4xl text-white">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#A0A0A0]">{label}</p>
      <p className="mt-3 text-xs text-[#A0A0A0]">{sub}</p>
    </div>
  );
}
