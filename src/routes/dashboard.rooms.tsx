import { createFileRoute, Link } from "@tanstack/react-router";
import { useHealth, useLiveMatches } from "@/hooks/use-kickoff";
import { matchRoomKey } from "@/lib/api";
import type { LiveMatch } from "@/lib/api";
import { isFinished, isLiveNow, partitionMatches } from "@/lib/match-live";
import { Users, Circle } from "lucide-react";

export const Route = createFileRoute("/dashboard/rooms")({
  component: RoomsPage,
});

function RoomsPage() {
  const { data: health } = useHealth();
  const { data: live } = useLiveMatches();
  const { liveNow, upcoming, finished } = partitionMatches(live?.matches ?? []);
  const openable = [...liveNow, ...upcoming];

  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
          // pears · hyperswarm
        </p>
        <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl md:text-6xl">
          Rooms
        </h1>
        <p className="mt-3 max-w-xl text-[#A0A0A0]">
          First fan on a fixture <strong className="text-white">creates</strong>{" "}
          the Hyperswarm room. The next fan <strong className="text-white">joins</strong>{" "}
          the same topic. Finished matches are recap-only.
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
          {health?.activeRooms ?? 0} room
          {(health?.activeRooms ?? 0) === 1 ? "" : "s"} active this session
        </p>
      </div>

      <RoomGrid title="Create / join" items={openable} />
      <RoomGrid title="Finished · recap only" items={finished} recap />
    </div>
  );
}

function RoomGrid({
  title,
  items,
  recap = false,
}: {
  title: string;
  items: LiveMatch[];
  recap?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
        {title}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((f) => {
          const roomKey = matchRoomKey(f.home, f.away, f.stage);
          const live = isLiveNow(f);
          return (
            <div key={f.id} className="glass min-w-0 overflow-hidden rounded-2xl p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl text-white sm:text-2xl">
                    {f.home} vs {f.away}
                  </p>
                  <p className="mt-2 truncate font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
                    topic:{roomKey}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
                    live
                      ? "bg-[#C6FF3D]/10 text-[#C6FF3D]"
                      : isFinished(f)
                        ? "bg-white/10 text-[#A0A0A0]"
                        : "bg-white/10 text-[#A0A0A0]"
                  }`}
                >
                  <Circle className="h-1.5 w-1.5 fill-current" />
                  {live ? "live" : isFinished(f) ? "FT" : "upcoming"}
                </span>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 font-mono text-xs text-[#A0A0A0]">
                  <Users className="h-3.5 w-3.5" strokeWidth={1.75} />{" "}
                  {recap ? "recap" : "P2P room"}
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
                {recap ? "View recap" : "Create / join room"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
