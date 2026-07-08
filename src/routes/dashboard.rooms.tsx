import { createFileRoute, Link } from "@tanstack/react-router";
import { ROOMS } from "@/lib/mock-data";
import { Users, Circle } from "lucide-react";

export const Route = createFileRoute("/dashboard/rooms")({
  component: RoomsPage,
});

function RoomsPage() {
  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// pears · hyperswarm</p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">Rooms</h1>
        <p className="mt-3 text-[#A0A0A0]">Peer-to-peer match rooms you're joined to. No server. No middleman.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ROOMS.map((r) => (
          <div key={r.id} className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-2xl text-white">{r.match}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">topic:{r.topic}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C6FF3D]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D]">
                <Circle className="h-1.5 w-1.5 fill-current" /> connected
              </span>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 font-mono text-xs text-[#A0A0A0]">
                <Users className="h-3.5 w-3.5" strokeWidth={1.75} /> {r.peers.toLocaleString()} peers
              </div>
              {r.unread > 0 && (
                <span className="rounded-full bg-white px-2.5 py-0.5 font-mono text-[10px] text-black">
                  {r.unread} new
                </span>
              )}
            </div>
            <Link to="/matches" className="mt-6 block rounded-full border border-white/20 py-2 text-center text-xs text-white hover:bg-white/5">
              Open room
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
