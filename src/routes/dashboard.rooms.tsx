import { createFileRoute, Link } from "@tanstack/react-router";
import { FIXTURES } from "@/lib/fixtures";
import { matchRoomKey } from "@/lib/api";
import { useHealth } from "@/hooks/use-kickoff";
import { Users, Circle } from "lucide-react";

export const Route = createFileRoute("/dashboard/rooms")({
  component: RoomsPage,
});

function RoomsPage() {
  const { data: health } = useHealth();

  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
          // pears · hyperswarm
        </p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">
          Rooms
        </h1>
        <p className="mt-3 text-[#A0A0A0]">
          Peer-to-peer match rooms. Join from a fixture — chat syncs over
          Hyperswarm, not a central server.
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
          {health?.activeRooms ?? 0} room
          {(health?.activeRooms ?? 0) === 1 ? "" : "s"} joined this session
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {FIXTURES.map((f) => {
          const roomKey = matchRoomKey(f.home, f.away, f.stage);
          return (
            <div key={f.id} className="glass rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-2xl text-white">
                    {f.home} vs {f.away}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
                    topic:{roomKey}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
                    f.status === "live"
                      ? "bg-[#C6FF3D]/10 text-[#C6FF3D]"
                      : "bg-white/10 text-[#A0A0A0]"
                  }`}
                >
                  <Circle className="h-1.5 w-1.5 fill-current" />
                  {f.status === "live" ? "live" : "upcoming"}
                </span>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 font-mono text-xs text-[#A0A0A0]">
                  <Users className="h-3.5 w-3.5" strokeWidth={1.75} /> P2P
                  room
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
                  {f.stage}
                </span>
              </div>
              <Link
                to="/matches/$matchId"
                params={{ matchId: f.id }}
                className="mt-6 block rounded-full border border-white/20 py-2 text-center text-xs text-white hover:bg-white/5"
              >
                Open room
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
