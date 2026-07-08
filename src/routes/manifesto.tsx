import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/manifesto")({
  head: () => ({
    meta: [
      { title: "Manifesto — KICKOFF" },
      { name: "description", content: "Football belongs to the fans. Why we built KICKOFF." },
      { property: "og:title", content: "Manifesto — KICKOFF" },
      { property: "og:description", content: "Football belongs to the fans. Why we built KICKOFF." },
    ],
  }),
  component: Manifesto,
});

function Manifesto() {
  return (
    <PageShell eyebrow="// n° 001" title="Football belongs to the fans.">
      <article className="mx-auto max-w-2xl space-y-8 text-lg leading-relaxed text-[#D8D8D8]">
        <p className="font-display text-3xl italic text-white">
          It has always been ours. The rest is just infrastructure.
        </p>
        <p>
          A century of gatekeepers built a wall between the pitch and the people. Broadcasters. Sanctioning bodies. Sportsbooks. Every conversation about a match now runs through someone else's server, someone else's advertising slot, someone else's terms of service.
        </p>
        <p>
          KICKOFF is a small refusal. Three refusals, actually.
        </p>
        <p>
          <span className="font-mono text-sm uppercase tracking-widest text-[#C6FF3D]">// one.</span> The AI that analyses your match runs on your device. Not in someone's data center. Not sold to an advertiser. The model is yours, the compute is yours, the reads are yours.
        </p>
        <p>
          <span className="font-mono text-sm uppercase tracking-widest text-[#C6FF3D]">// two.</span> The room you argue tactics in is a swarm of fans. No moderator, no advertiser, no shadow ban. Peer-to-peer, discovered on the DHT, verified by your own client.
        </p>
        <p>
          <span className="font-mono text-sm uppercase tracking-widest text-[#C6FF3D]">// three.</span> The money that flows between fans — tips, pools, wins — sits in wallets you hold the keys to. USDt on rails you can inspect. No custodian to freeze you out on the day of the final.
        </p>
        <p>
          The World Cup Final is July 19, 2026, at MetLife Stadium. Between now and then, KICKOFF is live and useful for every match. After that, it's still yours. It has to be.
        </p>
        <p className="pt-8 font-mono text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">— KICKOFF, July 2026</p>
      </article>
    </PageShell>
  );
}
