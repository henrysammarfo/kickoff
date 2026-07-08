import { Cpu, Radio, Wallet, Trophy, WifiOff, Users } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { Link } from "@tanstack/react-router";

const Spacer = () => <div className="h-[120px] md:h-[200px]" aria-hidden="true" />;

export function WhatItIs() {
  return (
    <section className="relative grid grid-cols-4 gap-6 px-6 md:grid-cols-12 md:px-12">
      <div className="col-span-4 md:col-span-4 lg:col-start-2 lg:col-span-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// 01 · what it is</p>
        <ScrollReveal
          as="h2"
          className="mt-6 font-display text-white"
        >
          {"A football second-brain. Owned by you, run by you."}
        </ScrollReveal>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-[#A0A0A0]">
          <p>KICKOFF is three things at once: an on-device match analyst, a peer-to-peer chatroom, and a self-custodial wallet. Every part runs on your machine.</p>
          <p>No accounts. No servers to trust. No API keys to lose. Just you, your fellow supporters, and the game.</p>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", title: "Open a match room", body: "Pick a fixture. Your device joins a DHT swarm — no server in between. Every fan in the room is a peer." },
  { n: "02", title: "Run local AI", body: "Feed the model live stats. Get tactical reads and predictions. The model never leaves your machine." },
  { n: "03", title: "Tip in USDt", body: "Love a call? Send USDt to another fan's self-custodial wallet. Or pool in on an outcome. Zero intermediaries." },
];

export function HowItWorks() {
  return (
    <section className="relative grid grid-cols-4 gap-6 px-6 md:grid-cols-12 md:px-12">
      <div className="col-span-4 md:col-span-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// 02 · how it works</p>
        <ScrollReveal as="h2" className="mt-6 max-w-3xl font-display text-white">
          {"Three moves. Zero permission."}
        </ScrollReveal>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="glass rounded-2xl p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">Step {s.n}</p>
              <h3 className="mt-6 font-display text-3xl text-white">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#A0A0A0]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: Radio, title: "P2P match rooms", body: "Hyperswarm DHT connects fans directly. No websocket to a backend." },
  { icon: Cpu, title: "Local AI", body: "QVAC runs Phi-3 / Llama on your device. Offline-capable. Zero data leakage." },
  { icon: Wallet, title: "Self-custodial USDt", body: "WDK wallet. You hold the keys. No custodian, no KYC gate." },
  { icon: Trophy, title: "Prediction pools", body: "Open a pool on any moment. Winners auto-settle in USDt." },
  { icon: WifiOff, title: "Offline-first", body: "Cut the wifi. The model still works. Sync when you're back." },
  { icon: Users, title: "No accounts", body: "Your peer ID is your identity. Nothing to sign up for. Ever." },
];

export function Features() {
  return (
    <section className="relative grid grid-cols-4 gap-6 px-6 md:grid-cols-12 md:px-12">
      <div className="col-span-4 md:col-span-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// 03 · key features</p>
        <ScrollReveal as="h2" className="mt-6 max-w-3xl font-display text-white">
          {"Every part is load-bearing. Remove one, KICKOFF breaks."}
        </ScrollReveal>
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="group bg-black p-8 transition-colors hover:bg-white/5">
              <f.icon className="h-6 w-6 text-white" strokeWidth={1.5} />
              <h3 className="mt-8 font-display text-2xl text-white">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { k: "0", label: "servers" },
  { k: "100%", label: "on-device AI" },
  { k: "1", label: "currency · USDt" },
  { k: "48", label: "matches to July 19" },
];

export function Proof() {
  return (
    <section className="relative grid grid-cols-4 gap-6 px-6 md:grid-cols-12 md:px-12">
      <div className="col-span-4 md:col-span-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// 04 · proof</p>
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-6xl text-white md:text-7xl">{s.k}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative grid grid-cols-4 gap-6 px-6 md:grid-cols-12 md:px-12">
      <div className="col-span-4 md:col-span-12">
        <ScrollReveal
          as="h2"
          className="mx-auto max-w-4xl text-center font-display leading-[0.95] text-white"
        >
          {"The final is July 19. You're already late."}
        </ScrollReveal>
        <div className="mt-12 flex justify-center">
          <Link
            to="/download"
            className="rounded-full bg-[#C6FF3D] px-8 py-4 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
          >
            Download KICKOFF
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-[120px] px-4 pb-6 md:mt-[200px] md:px-6">
      <div className="glass mx-auto max-w-7xl rounded-2xl px-8 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <p className="font-display text-3xl text-white">KICKOFF</p>
            <p className="mt-4 max-w-sm text-sm text-[#A0A0A0]">
              Peer-to-peer football intelligence. Built for WC26 on Pears, QVAC, and WDK.
            </p>
          </div>
          <FooterCol title="Product" links={[["/matches","Matches"],["/how-it-works","How it works"],["/download","Download"]]} />
          <FooterCol title="Fans" links={[["/manifesto","Manifesto"],["/merch","Merch"],["/dashboard","Dashboard"]]} />
          <FooterCol title="Stack" links={[["/how-it-works","Pears"],["/how-it-works","QVAC"],["/how-it-works","WDK"]]} />
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#A0A0A0]">
          <p>© 2026 KICKOFF · Tether Developers Cup</p>
          <p>Not affiliated with FIFA</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map(([to, label]) => (
          <li key={label}>
            <Link to={to} className="text-sm text-white hover:text-[#C6FF3D]">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Spacer };
