import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Radio, Cpu, Wallet } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — KICKOFF" },
      { name: "description", content: "The three-part stack: Pears P2P, QVAC local AI, WDK self-custodial USDt." },
      { property: "og:title", content: "How it works — KICKOFF" },
      { property: "og:description", content: "Pears + QVAC + WDK. Every layer runs on your device." },
    ],
  }),
  component: HowItWorksPage,
});

const CHAPTERS = [
  {
    n: "01", icon: Radio, title: "Pears — P2P rooms",
    body: "Every match derives a topic from its name (SHA-256). Your device joins a Hyperswarm DHT swarm on that topic. You discover other fans directly. Chat, tips, and pool updates flow peer-to-peer.",
    proof: "Proof: open the network inspector during a match. Zero HTTP calls to any backend for chat.",
  },
  {
    n: "02", icon: Cpu, title: "QVAC — Local AI",
    body: "A Phi-3 or Llama model runs entirely on your machine. Feed it live match stats — score, minute, possession, shots. Get a one-line tactical read + prediction + confidence. All inference is local.",
    proof: "Proof: pull the ethernet cable. Analysis still works.",
  },
  {
    n: "03", icon: Wallet, title: "WDK — Self-custodial USDt",
    body: "The Wallet Development Kit spins you a self-custodial wallet on first launch. You hold the keys. Tip other fans, join prediction pools, get paid on winning outcomes — all in USDt, all P2P.",
    proof: "Proof: no signup, no KYC, no custody. Your keys, your funds.",
  },
];

function HowItWorksPage() {
  return (
    <PageShell
      eyebrow="// the stack"
      title="Three pillars. Zero servers."
      lede="KICKOFF is built on Pears, QVAC, and WDK. Each piece is essential — remove one and the product collapses."
    >
      <div className="space-y-24">
        {CHAPTERS.map((c) => (
          <article key={c.n} className="grid grid-cols-12 gap-6 border-t border-white/10 pt-16">
            <div className="col-span-12 md:col-span-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">Chapter {c.n}</p>
              <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10">
                <c.icon className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 font-display text-4xl text-white md:text-5xl">{c.title}</h2>
            </div>
            <div className="col-span-12 space-y-6 md:col-span-7 md:col-start-6">
              <p className="text-lg leading-relaxed text-[#A0A0A0]">{c.body}</p>
              <div className="glass rounded-xl px-5 py-4 font-mono text-xs text-[#C6FF3D]">
                {c.proof}
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
