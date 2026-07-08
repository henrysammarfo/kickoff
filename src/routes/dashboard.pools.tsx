import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  usePools,
  useCreatePool,
  useJoinPool,
  useWallet,
  useLiveMatches,
} from "@/hooks/use-kickoff";
import { matchRoomKey } from "@/lib/api";
import { partitionMatches } from "@/lib/match-live";
import { Trophy, Plus, Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/pools")({
  component: PoolsPage,
});

function PoolsPage() {
  const { data: pools, isLoading } = usePools();
  const createPool = useCreatePool();
  const joinPool = useJoinPool();
  const { data: wallet } = useWallet();
  const { data: live } = useLiveMatches();
  const { upcoming } = partitionMatches(live?.matches ?? []);
  const poolFixtures = upcoming.length > 0 ? upcoming : (live?.matches ?? []);

  const [showForm, setShowForm] = useState(false);
  const [matchId, setMatchId] = useState("");
  const [stake, setStake] = useState("5");

  useEffect(() => {
    if (!matchId && poolFixtures[0]?.id) {
      setMatchId(poolFixtures[0].id);
    }
  }, [matchId, poolFixtures]);

  const handleCreate = () => {
    const fixture = poolFixtures.find((f) => f.id === matchId);
    if (!fixture) return;
    const matchName = matchRoomKey(fixture.home, fixture.away, fixture.stage);
    createPool.mutate(
      { matchName, stakeUsdt: Number(stake) },
      { onSuccess: () => setShowForm(false) },
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
            // prediction pools · usdt
          </p>
          <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl md:text-6xl">
            Pools
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#C6FF3D] px-5 py-2.5 text-sm font-medium text-black hover:bg-white"
        >
          <Plus className="h-4 w-4" strokeWidth={2} /> New pool
        </button>
      </div>

      {showForm && (
        <div className="glass flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:flex-wrap sm:items-end sm:p-6">
          <label className="flex min-w-0 flex-1 flex-col gap-2 sm:min-w-[200px]">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
              Match
            </span>
            <select
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-2 text-sm text-white"
            >
              {poolFixtures.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.stage} · {f.home} vs {f.away}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
              Stake (USDt)
            </span>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-2 text-sm text-white sm:w-28"
            />
          </label>
          <button
            type="button"
            onClick={handleCreate}
            disabled={createPool.isPending || !matchId}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-[#C6FF3D] disabled:opacity-50 sm:w-auto"
          >
            {createPool.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Create
          </button>
        </div>
      )}

      {isLoading && (
        <p className="text-sm text-[#A0A0A0]">Loading pools from API…</p>
      )}

      <div className="grid gap-4">
        {(pools ?? []).map((p) => (
          <div
            key={p.id}
            className="glass flex flex-col gap-4 rounded-2xl p-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:p-6 md:gap-6"
          >
            <div className="min-w-0 sm:col-span-12 md:col-span-5">
              <p className="truncate font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
                {p.matchName}
              </p>
              <p className="mt-2 font-display text-xl text-white sm:text-2xl">
                Score prediction
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:contents">
              <div className="sm:col-span-2">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#A0A0A0]">
                  Entry
                </p>
                <p className="mt-1 font-mono text-lg text-white">
                  {p.stakeUsdt}{" "}
                  <span className="text-xs text-[#A0A0A0]">USDt</span>
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#A0A0A0]">
                  Pot
                </p>
                <p className="mt-1 font-mono text-lg text-[#C6FF3D]">
                  {p.totalPot}{" "}
                  <span className="text-xs opacity-70">USDt</span>
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#A0A0A0]">
                  Entries
                </p>
                <p className="mt-1 font-mono text-xs text-white">
                  {p.entries.length} · {p.status}
                </p>
              </div>
            </div>
            <div className="sm:col-span-12 md:col-span-1 md:text-right">
              <button
                type="button"
                onClick={() => {
                  if (!wallet?.address) return;
                  joinPool.mutate({
                    poolId: p.id,
                    prediction: { homeGoals: 1, awayGoals: 0 },
                    fanWalletAddress: wallet.address,
                  });
                }}
                disabled={joinPool.isPending || p.status !== "open"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs text-white hover:bg-white/5 disabled:opacity-40 sm:w-auto"
              >
                <Trophy className="h-3.5 w-3.5" strokeWidth={1.75} /> Join
              </button>
            </div>
          </div>
        ))}
        {!isLoading && (pools ?? []).length === 0 && (
          <p className="text-sm text-[#A0A0A0]">
            No pools yet — create one or join from a match room.
          </p>
        )}
      </div>
    </div>
  );
}
