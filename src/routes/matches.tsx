import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { MATCHES } from "@/lib/mock-data";
import { Radio, Users, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Matches — KICKOFF" },
      { name: "description", content: "Live and upcoming World Cup 2026 fixtures. Join a peer-to-peer fan room." },
      { property: "og:title", content: "Matches — KICKOFF" },
      { property: "og:description", content: "Live and upcoming WC26 fixtures. Join a P2P fan room." },
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
        {MATCHES.map((m) => (
          <Link
            key={m.id}
            to="/matches/$matchId"
            params={{ matchId: m.id }}
            className="group grid grid-cols-12 items-center gap-4 bg-black p-6 transition-colors hover:bg-white/5"
          >
            <div className="col-span-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#A0A0A0]">
              {m.status === "live" && <span className="h-1.5 w-1.5 rounded-full bg-[#C6FF3D]" />}
              {m.stage} · {m.kickoff}
            </div>
            <div className="col-span-6 flex items-center gap-4">
              <span className="text-2xl">{m.homeFlag}</span>
              <span className="font-display text-2xl text-white md:text-3xl">{m.home}</span>
              <span className="font-mono text-xs text-[#A0A0A0]">{m.score}</span>
              <span className="font-display text-2xl text-white md:text-3xl">{m.away}</span>
              <span className="text-2xl">{m.awayFlag}</span>
              {m.status === "live" && (
                <span className="ml-2 rounded-full bg-[#C6FF3D]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D]">{m.minute}</span>
              )}
            </div>
            <div className="col-span-2 flex items-center gap-2 font-mono text-[11px] text-[#A0A0A0]">
              <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
              {m.peers.toLocaleString()}
            </div>
            <div className="col-span-1 flex justify-end">
              <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-12 flex items-center gap-3 text-sm text-[#A0A0A0]">
        <Radio className="h-4 w-4" strokeWidth={1.5} />
        Peer counts update in real time via Hyperswarm.
      </div>
    </PageShell>
  );
}
