import { createFileRoute } from "@tanstack/react-router";
import { POOLS } from "@/lib/mock-data";
import { Trophy, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/pools")({
  component: PoolsPage,
});

function PoolsPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// prediction pools · usdt</p>
          <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">Pools</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-[#C6FF3D] px-5 py-2.5 text-sm font-medium text-black hover:bg-white">
          <Plus className="h-4 w-4" strokeWidth={2} /> New pool
        </button>
      </div>

      <div className="grid gap-4">
        {POOLS.map((p) => (
          <div key={p.id} className="glass grid grid-cols-12 items-center gap-6 rounded-2xl p-6">
            <div className="col-span-12 md:col-span-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">{p.match}</p>
              <p className="mt-2 font-display text-2xl text-white">{p.question}</p>
            </div>
            <div className="col-span-4 md:col-span-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#A0A0A0]">Entry</p>
              <p className="mt-1 font-mono text-lg text-white">{p.entry} <span className="text-xs text-[#A0A0A0]">USDt</span></p>
            </div>
            <div className="col-span-4 md:col-span-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#A0A0A0]">Pot</p>
              <p className="mt-1 font-mono text-lg text-[#C6FF3D]">{p.pot} <span className="text-xs opacity-70">USDt</span></p>
            </div>
            <div className="col-span-4 md:col-span-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#A0A0A0]">Closes</p>
              <p className="mt-1 font-mono text-xs text-white">{p.closes}</p>
            </div>
            <div className="col-span-12 md:col-span-1 md:text-right">
              <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs text-white hover:bg-white/5">
                <Trophy className="h-3.5 w-3.5" strokeWidth={1.75} /> Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
