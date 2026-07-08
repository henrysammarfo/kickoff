import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Wallet, Radio, Trophy, Cpu, Circle } from "lucide-react";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { WALLET } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — KICKOFF" },
      { name: "description", content: "Your wallet, rooms, pools, and local AI — all on your device." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardLayout,
});

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { to: "/dashboard/rooms", label: "Rooms", icon: Radio },
  { to: "/dashboard/pools", label: "Pools", icon: Trophy },
  { to: "/dashboard/ai", label: "Local AI", icon: Cpu },
];

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 p-6 md:flex md:flex-col">
        <Link to="/"><LogoLockup size={22} /></Link>
        <nav className="mt-10 flex flex-col gap-1">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-white/10 text-white" : "text-[#A0A0A0] hover:bg-white/5 hover:text-white"
                }`}
              >
                <n.icon className="h-4 w-4" strokeWidth={1.75} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-4">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#A0A0A0]">Peer ID</p>
            <p className="mt-1 font-mono text-xs text-white">{WALLET.address}</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
            <Circle className="h-2 w-2 fill-[#C6FF3D] text-[#C6FF3D]" /> DHT connected · 47 peers
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C6FF3D]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D]">
              <Circle className="h-1.5 w-1.5 fill-current" /> LIVE
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#A0A0A0]">Canada 1 - 1 Morocco · 67'</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-xs text-white">
              {WALLET.balance.toFixed(2)} <span className="text-[#A0A0A0]">USDt</span>
            </div>
          </div>
        </header>
        <main className="px-6 py-10 md:px-10 md:py-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
