import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { FIXTURES } from "@/lib/fixtures";
import { Radio, Users, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Matches — KICKOFF" },
      {
        name: "description",
        content:
          "Live and upcoming World Cup 2026 fixtures. Join a peer-to-peer fan room.",
      },
      { property: "og:title", content: "Matches — KICKOFF" },
      {
        property: "og:description",
        content: "Live and upcoming WC26 fixtures. Join a P2P fan room.",
      },
    ],
  }),
  component: Matches,
});

function Matches() {
  return (
    <PageShell
      eyebrow="// fixtures · wc26"
      title="Every match. Every room."
      lede="Pick a fixture, join a peer-to-peer room, tap into live on-device AI reads with the rest of the world."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10">
        {FIXTURES.map((m) => (
          <Link
            key={m.id}
            to="/matches/$matchId"
            params={{ matchId: m.id }}
            className="group flex flex-col gap-3 bg-black p-4 transition-colors hover:bg-white/5 sm:p-6 md:grid md:grid-cols-12 md:items-center md:gap-4"
          >
            <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#A0A0A0] md:col-span-3">
              {m.status === "live" && (
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
              <span className="font-mono text-xs text-[#A0A0A0]">{m.score}</span>
              <span className="font-display text-xl text-white sm:text-2xl md:text-3xl">
                {m.away}
              </span>
              <span className="text-xl sm:text-2xl">{m.awayFlag}</span>
              {m.status === "live" && (
                <span className="rounded-full bg-[#C6FF3D]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D]">
                  {m.minute}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#A0A0A0] md:col-span-3 md:justify-end">
              <span className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
                Join room
              </span>
              <ArrowRight
                className="h-4 w-4 text-white transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-12 flex items-center gap-3 text-sm text-[#A0A0A0]">
        <Radio className="h-4 w-4" strokeWidth={1.5} />
        Rooms sync peer-to-peer via Hyperswarm — local API at :3001 bootstraps your node.
      </div>
    </PageShell>
  );
}
