import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Wallet, Radio, Trophy, Cpu, Circle } from "lucide-react";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { ApiBanner } from "@/components/ApiBanner";
import { useHealth, useWallet } from "@/hooks/use-kickoff";
import { truncateAddress } from "@/lib/api";
import { FIXTURES } from "@/lib/fixtures";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — KICKOFF" },
      {
        name: "description",
        content: "Your wallet, rooms, pools, and local AI — all on your device.",
      },
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
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data: health } = useHealth();

  const liveFixture = FIXTURES.find((f) => f.status === "live");
  const headerScore = liveFixture
    ? `${liveFixture.home.slice(0, 3).toUpperCase()} ${liveFixture.score.replace(/\s/g, "")} ${liveFixture.away.slice(0, 3).toUpperCase()} · ${liveFixture.minute}`
    : "API connected · local stack";

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 p-6 md:flex md:flex-col">
        <Link to="/">
          <LogoLockup size={22} />
        </Link>
        <nav className="mt-10 flex flex-col gap-1">
          {NAV.map((n) => {
            const active = n.exact
              ? pathname === n.to
              : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-[#A0A0A0] hover:bg-white/5 hover:text-white"
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
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#A0A0A0]">
              Wallet
            </p>
            <p className="mt-1 font-mono text-xs text-white">
              {wallet?.address
                ? truncateAddress(wallet.address, 6)
                : walletLoading
                  ? "…"
                  : "—"}
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
            <Circle
              className={`h-2 w-2 fill-current ${
                health?.status === "ok"
                  ? "text-[#C6FF3D]"
                  : "text-amber-400"
              }`}
            />
            {health?.status === "ok"
              ? `${health.activeRooms} active room${health.activeRooms === 1 ? "" : "s"}`
              : "API offline"}
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <ApiBanner />
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-6 md:px-10 md:py-4">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <Link to="/" className="shrink-0 md:hidden">
              <LogoLockup size={18} />
            </Link>
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-[#C6FF3D]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D] sm:inline-flex">
              <Circle className="h-1.5 w-1.5 fill-current" />{" "}
              {health?.qvac ? "QVAC" : "LOCAL"}
            </span>
            <span className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] sm:text-[11px] sm:tracking-[0.25em]">
              {headerScore}
            </span>
          </div>
          <div className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 font-mono text-xs text-white sm:px-4">
            {walletLoading
              ? "…"
              : (wallet?.usdt ?? 0).toFixed(2)}{" "}
            <span className="text-[#A0A0A0]">USDt</span>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-white/10 px-4 py-3 md:hidden">
          {NAV.map((n) => {
            const active = n.exact
              ? pathname === n.to
              : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors ${
                  active ? "bg-white/10 text-white" : "text-[#A0A0A0]"
                }`}
              >
                <n.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <main className="px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
