import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { ApiBanner } from "@/components/ApiBanner";
import { getFixture } from "@/lib/fixtures";
import { matchRoomKey, truncateAddress } from "@/lib/api";
import {
  useAnalyzeMatch,
  useJoinRoom,
  usePools,
  useRoomMessages,
  useSendMessage,
  useTip,
  useWallet,
  useAiStatus,
  useCreatePool,
  useJoinPool,
  useLiveMatch,
  useLiveDataStatus,
  useSettlePool,
} from "@/hooks/use-kickoff";
import { Cpu, Users, Trophy, Send, Sparkles, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/matches/$matchId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.matchId.toUpperCase()} — KICKOFF` },
      {
        name: "description",
        content: "Live match room. On-device AI. Peer-to-peer chat. USDt pools.",
      },
    ],
  }),
  component: MatchRoom,
});

function MatchRoom() {
  const { matchId } = useParams({ from: "/matches/$matchId" });
  const fallback = getFixture(matchId);
  const { data: live } = useLiveMatch(matchId);
  const { data: liveStatus } = useLiveDataStatus();
  const m = live?.match ?? fallback;
  const roomName = m.roomKey ?? matchRoomKey(m.home, m.away, m.stage);

  const joinRoom = useJoinRoom();
  const { data: messages } = useRoomMessages(roomName, joinRoom.isSuccess);
  const analyze = useAnalyzeMatch();
  const sendMsg = useSendMessage();
  const tip = useTip();
  const { data: wallet } = useWallet();
  const { data: aiStatus } = useAiStatus();
  const { data: pools } = usePools();
  const createPool = useCreatePool();
  const joinPool = useJoinPool();
  const settlePool = useSettlePool();

  const [chatText, setChatText] = useState("");
  const [tipOpen, setTipOpen] = useState(false);
  const [tipAddr, setTipAddr] = useState("");
  const [tipAmt, setTipAmt] = useState("0.5");
  const [settleHg, setSettleHg] = useState("1");
  const [settleAg, setSettleAg] = useState("1");

  useEffect(() => {
    joinRoom.mutate(roomName);
  }, [roomName]);

  const matchPools = pools?.filter((p) => p.matchName.includes(m.home)) ?? [];
  const peers = joinRoom.data?.peers ?? 0;
  const dataSource = live?.source ?? "fixtures";

  const runAnalysis = () => {
    const [homeGoals, awayGoals] = m.score.split("-").map((s) => s.trim());
    analyze.mutate({
      homeTeam: m.home,
      awayTeam: m.away,
      score: `${homeGoals}-${awayGoals}`,
      minute: m.minute.replace("'", "") || "0",
      homePossession: m.homePossession,
      homeShots: m.homeShots,
      awayShots: m.awayShots,
      recentEvents: m.recentEvents ?? [],
    });
  };

  return (
    <PageShell>
      <ApiBanner />
      <Link
        to="/matches"
        className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> All matches
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
            {m.stage} · {m.venue} · {m.kickoff}
            {liveStatus?.tinyfishConfigured ? (
              <span className="ml-2 text-[#A0A0A0]">
                · live data ({dataSource})
              </span>
            ) : null}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 md:gap-6">
            <span className="text-5xl md:text-6xl">{m.homeFlag}</span>
            <span className="font-display text-4xl text-white md:text-7xl">{m.home}</span>
            <span className="font-mono text-2xl text-[#A0A0A0] md:text-3xl">{m.score}</span>
            <span className="font-display text-4xl text-white md:text-7xl">{m.away}</span>
            <span className="text-5xl md:text-6xl">{m.awayFlag}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {m.status === "live" && (
            <span className="rounded-full bg-[#C6FF3D]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D]">
              LIVE · {m.minute}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
            <Users className="h-3 w-3" strokeWidth={1.5} /> {peers} peers · hyperswarm
          </span>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* Local AI */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
              <Cpu className="h-3.5 w-3.5 text-[#C6FF3D]" strokeWidth={1.75} />
              Local AI · {aiStatus?.model ?? "QVAC"}
            </div>
            <button
              type="button"
              onClick={runAnalysis}
              disabled={analyze.isPending || !aiStatus?.ready}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-[#C6FF3D] disabled:opacity-50"
            >
              {analyze.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
              )}
              Analyze with local AI
            </button>
          </div>

          {analyze.isError && (
            <p className="text-sm text-red-400">{analyze.error.message}</p>
          )}

          {analyze.data ? (
            <div className="space-y-5">
              <AiRead label="ANALYSIS" body={analyze.data.analysis} />
              <AiRead label="PREDICTION" body={analyze.data.prediction} />
              <AiRead
                label="CONFIDENCE"
                body={`${analyze.data.confidence}%`}
                mono
              />
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D]">
                Ran on your device · {analyze.data.processingTimeMs}ms ·{" "}
                {analyze.data.mode}
              </p>
              <button
                type="button"
                onClick={() =>
                  sendMsg.mutate({
                    matchName: roomName,
                    text: `AI read: ${analyze.data?.prediction}`,
                    aiAnalysis: analyze.data,
                  })
                }
                className="rounded-full border border-white/20 px-4 py-2 text-xs text-white hover:bg-white/5"
              >
                Share to room
              </button>
            </div>
          ) : (
            <p className="text-[#A0A0A0]">
              Tap analyze — works offline once QVAC model is loaded.
            </p>
          )}
        </div>

        {/* Pools */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
              <Trophy className="h-3.5 w-3.5 text-[#C6FF3D]" strokeWidth={1.75} />
              Pools
            </div>
            <button
              type="button"
              onClick={() =>
                createPool.mutate({
                  matchName: `${m.home} vs ${m.away}`,
                  stakeUsdt: 1,
                })
              }
              className="font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D] hover:underline"
            >
              + Create
            </button>
          </div>
          <div className="space-y-4">
            {matchPools.length === 0 && (
              <p className="text-sm text-[#A0A0A0]">No pools yet.</p>
            )}
            {matchPools.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0"
              >
                <div>
                  <p className="text-sm text-white">Pool {p.id}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
                    Stake {p.stakeUsdt} · Pot {p.totalPot} USDt
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!wallet?.address) return;
                    const [hg, ag] = m.score.split("-").map((x) => parseInt(x.trim(), 10) || 0);
                    joinPool.mutate({
                      poolId: p.id,
                      prediction: { homeGoals: hg, awayGoals: ag },
                      fanWalletAddress: wallet.address,
                    });
                  }}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-white hover:bg-white/10"
                >
                  Join
                </button>
                {p.status === "open" && (
                  <button
                    type="button"
                    onClick={() =>
                      settlePool.mutate({
                        poolId: p.id,
                        actualResult: {
                          homeGoals: parseInt(settleHg, 10) || 0,
                          awayGoals: parseInt(settleAg, 10) || 0,
                        },
                      })
                    }
                    className="rounded-full border border-[#C6FF3D]/40 px-3 py-1 text-xs text-[#C6FF3D] hover:bg-[#C6FF3D]/10"
                  >
                    Settle
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* P2P Chat */}
        <div className="glass rounded-2xl p-6 lg:col-span-3">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
              <Users className="h-3.5 w-3.5" strokeWidth={1.75} /> Peer chat ·{" "}
              {peers} online
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
              hyperswarm · no central chat server
            </span>
          </div>
          <div className="max-h-64 space-y-3 overflow-y-auto border-t border-white/10 pt-4">
            {(messages?.messages ?? []).map((msg, i) => (
              <div key={`${msg.timestamp}-${i}`} className="flex gap-3 text-sm">
                <span className="shrink-0 font-mono text-[11px] text-[#C6FF3D]">
                  {truncateAddress(msg.peerId, 6)}
                </span>
                <span className="text-white/90">{msg.text}</span>
                {msg.aiAnalysis ? (
                  <span className="font-mono text-[9px] uppercase text-[#A0A0A0]">
                    + AI
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
            <input
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && chatText.trim()) {
                  sendMsg.mutate({ matchName: roomName, text: chatText.trim() });
                  setChatText("");
                }
              }}
              placeholder={`Message ${peers} fans…`}
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder-[#A0A0A0] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setTipOpen(!tipOpen)}
              className="rounded-full border border-white/20 px-3 py-2 text-xs text-white"
            >
              Tip
            </button>
            <button
              type="button"
              onClick={() => {
                if (!chatText.trim()) return;
                sendMsg.mutate({
                  matchName: roomName,
                  text: chatText.trim(),
                  aiAnalysis: analyze.data,
                });
                setChatText("");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#C6FF3D] px-4 py-2 text-xs font-medium text-black"
            >
              <Send className="h-3.5 w-3.5" strokeWidth={1.75} /> Broadcast
            </button>
          </div>
          {tipOpen && (
            <div className="mt-4 flex flex-wrap gap-2 rounded-xl border border-white/10 p-4">
              <input
                value={tipAddr}
                onChange={(e) => setTipAddr(e.target.value)}
                placeholder="Recipient 0x…"
                className="min-w-[200px] flex-1 bg-black/40 px-3 py-2 font-mono text-xs text-white"
              />
              <input
                value={tipAmt}
                onChange={(e) => setTipAmt(e.target.value)}
                className="w-20 bg-black/40 px-3 py-2 font-mono text-xs text-white"
              />
              <button
                type="button"
                onClick={() =>
                  tip.mutate({
                    recipientAddress: tipAddr,
                    amountUsdt: parseFloat(tipAmt),
                    note: "KICKOFF tip",
                  })
                }
                className="rounded-full bg-white px-4 py-2 text-xs text-black"
              >
                Send USDt
              </button>
              {tip.data?.txHash && (
                <p className="w-full font-mono text-[10px] text-[#C6FF3D]">
                  TX {tip.data.txHash.slice(0, 18)}…
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function AiRead({
  label,
  body,
  mono,
}: {
  label: string;
  body: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
        {label}
      </p>
      <p
        className={`mt-2 ${mono ? "font-mono text-3xl text-[#C6FF3D]" : "text-lg text-white"}`}
      >
        {body}
      </p>
    </div>
  );
}
