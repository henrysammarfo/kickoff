import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { MATCHES } from "@/lib/mock-data";
import { Cpu, Users, Trophy, Send, Sparkles, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/matches/$matchId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.matchId.toUpperCase()} — KICKOFF` },
      { name: "description", content: "Live match room. On-device AI. Peer-to-peer chat. USDt pools." },
    ],
  }),
  component: MatchRoom,
});

function MatchRoom() {
  const { matchId } = useParams({ from: "/matches/$matchId" });
  const m = MATCHES.find((x) => x.id === matchId) ?? MATCHES[0];

  return (
    <PageShell>
      <Link to="/matches" className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#A0A0A0] hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> All matches
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
            {m.stage} · {m.venue} · {m.kickoff}
          </p>
          <div className="mt-6 flex items-center gap-6">
            <div className="text-6xl">{m.homeFlag}</div>
            <div className="font-display text-5xl text-white md:text-7xl">{m.home}</div>
            <div className="font-mono text-3xl text-[#A0A0A0]">{m.score}</div>
            <div className="font-display text-5xl text-white md:text-7xl">{m.away}</div>
            <div className="text-6xl">{m.awayFlag}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {m.status === "live" && (
            <span className="rounded-full bg-[#C6FF3D]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D]">
              LIVE · {m.minute}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">
            <Users className="h-3 w-3" strokeWidth={1.5} /> {m.peers.toLocaleString()} peers
          </span>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
              <Cpu className="h-3.5 w-3.5 text-[#C6FF3D]" strokeWidth={1.75} /> Local AI · Phi-3 Mini
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-[#C6FF3D]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} /> Re-analyse
            </button>
          </div>
          <div className="space-y-5">
            <AiRead label="ANALYSIS" body={`${m.home} pressing high, forcing turnovers in the middle third. ${m.away} sitting deep, waiting for the counter.`} />
            <AiRead label="PREDICTION" body={`Next goal in ${m.home}'s favour within 10 minutes if the press holds.`} />
            <AiRead label="CONFIDENCE" body="72%" mono />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
            <Trophy className="h-3.5 w-3.5 text-[#C6FF3D]" strokeWidth={1.75} /> Open pools
          </div>
          <div className="space-y-4">
            <PoolRow q="First scorer" entry={10} pot={340} />
            <PoolRow q="Full-time result" entry={5} pot={185} />
            <PoolRow q="Over 2.5 goals" entry={20} pot={780} />
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
              <Users className="h-3.5 w-3.5" strokeWidth={1.75} /> Peer chat · {m.peers.toLocaleString()} online
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">no server · e2e</span>
          </div>
          <div className="space-y-3 border-t border-white/10 pt-4">
            <ChatLine peer="a8f3" text="Bruno should be pressing higher, look at that gap" />
            <ChatLine peer="c221" text="AI just called next goal for us. Sending you 2 USDt for the read 🔥" />
            <ChatLine peer="ff01" text="Pool's still open for first scorer, get in" />
            <ChatLine peer="9c1e" text="Ref is asleep" />
          </div>
          <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
            <input
              placeholder="Say something to 2,431 fans…"
              className="flex-1 bg-transparent text-sm text-white placeholder-[#A0A0A0] focus:outline-none"
            />
            <button className="inline-flex items-center gap-2 rounded-full bg-[#C6FF3D] px-4 py-2 text-xs font-medium text-black">
              <Send className="h-3.5 w-3.5" strokeWidth={1.75} /> Broadcast
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function AiRead({ label, body, mono }: { label: string; body: string; mono?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">{label}</p>
      <p className={`mt-2 ${mono ? "font-mono text-3xl text-[#C6FF3D]" : "text-lg text-white"}`}>{body}</p>
    </div>
  );
}

function PoolRow({ q, entry, pot }: { q: string; entry: number; pot: number }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0">
      <div>
        <p className="text-sm text-white">{q}</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">Entry {entry} · Pot {pot} USDt</p>
      </div>
      <button className="rounded-full border border-white/20 px-3 py-1 text-xs text-white hover:bg-white/10">Join</button>
    </div>
  );
}

function ChatLine({ peer, text }: { peer: string; text: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="font-mono text-[11px] text-[#C6FF3D]">peer:{peer}</span>
      <span className="text-white/90">{text}</span>
    </div>
  );
}
