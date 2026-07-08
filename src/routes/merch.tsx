import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { Logomark } from "@/components/brand/Logomark";
import { Wordmark } from "@/components/brand/Wordmark";

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merch — KICKOFF" },
      { name: "description", content: "Hoodies, tees, caps, and prints. The KICKOFF brand system, on your back." },
      { property: "og:title", content: "Merch — KICKOFF" },
      { property: "og:description", content: "The KICKOFF brand system on hoodies, tees, and caps." },
    ],
  }),
  component: Merch,
});

function Merch() {
  return (
    <PageShell
      eyebrow="// wear it"
      title="For the fans who own it."
      lede="A brand system built to hold up on merch. Single-color mark, tight wordmark, one accent. Below: how it wears."
    >
      {/* Brand assets grid */}
      <section className="mb-24 grid gap-6 md:grid-cols-3">
        <BrandCard label="Primary lockup" bg="bg-black">
          <div className="text-white"><LogoLockup size={40} /></div>
        </BrandCard>
        <BrandCard label="Stacked lockup" bg="bg-white">
          <div className="text-black"><LogoLockup size={40} stacked /></div>
        </BrandCard>
        <BrandCard label="Mark only" bg="bg-[#C6FF3D]">
          <div className="text-black"><Logomark size={72} /></div>
        </BrandCard>
      </section>

      {/* Merch mockups */}
      <section>
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// drops</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Hoodie color="bg-black" text="text-white" name="Terrace Hoodie · Black" price="$68" />
          <Hoodie color="bg-[#111]" text="text-[#C6FF3D]" name="Away Hoodie · Pitch" price="$68" />
          <Hoodie color="bg-white" text="text-black" name="Home Hoodie · Chalk" price="$68" />
          <Tee color="bg-black" text="text-white" name="Standard Tee · Black" price="$32" />
          <Cap color="bg-black" text="text-[#C6FF3D]" name="Ref Cap · Pitch tab" price="$28" />
          <Poster />
        </div>
      </section>

      <p className="mt-16 max-w-xl text-sm text-[#A0A0A0]">
        Merch drops post-tournament. Enter the pool of holders — the top 100 tip senders during WC26 get first access.
      </p>
    </PageShell>
  );
}

function BrandCard({ label, bg, children }: { label: string; bg: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className={`flex aspect-square items-center justify-center rounded-xl ${bg}`}>{children}</div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">{label}</p>
    </div>
  );
}

function Hoodie({ color, text, name, price }: { color: string; text: string; name: string; price: string }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className={`relative flex aspect-[4/5] items-center justify-center ${color}`}>
        <svg viewBox="0 0 200 240" className="h-full w-full">
          <path d="M40 60 L70 40 L100 55 L130 40 L160 60 L180 90 L165 100 L165 220 L35 220 L35 100 L20 90 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          <path d="M70 40 Q100 65 130 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          <g transform="translate(100,140)" className={text}>
            <text textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="28" fill="currentColor">KICKOFF</text>
            <text textAnchor="middle" y="18" fontFamily="JetBrains Mono, monospace" fontSize="7" letterSpacing="3" fill="currentColor" opacity="0.7">// WC26 · P2P</text>
          </g>
        </svg>
      </div>
      <div className="flex items-center justify-between p-5">
        <p className="text-sm text-white">{name}</p>
        <p className="font-mono text-xs text-[#C6FF3D]">{price}</p>
      </div>
    </div>
  );
}

function Tee({ color, text, name, price }: { color: string; text: string; name: string; price: string }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className={`relative flex aspect-[4/5] items-center justify-center ${color}`}>
        <svg viewBox="0 0 200 240" className="h-full w-full">
          <path d="M40 55 L70 35 L100 50 L130 35 L160 55 L180 80 L160 95 L160 220 L40 220 L40 95 L20 80 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          <g transform="translate(100,130)" className={text}>
            <text textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="24" fill="currentColor">K</text>
            <text textAnchor="middle" y="22" fontFamily="JetBrains Mono, monospace" fontSize="6" letterSpacing="2.5" fill="currentColor" opacity="0.7">KICKOFF</text>
          </g>
        </svg>
      </div>
      <div className="flex items-center justify-between p-5">
        <p className="text-sm text-white">{name}</p>
        <p className="font-mono text-xs text-[#C6FF3D]">{price}</p>
      </div>
    </div>
  );
}

function Cap({ color, text, name, price }: { color: string; text: string; name: string; price: string }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className={`relative flex aspect-[4/5] items-center justify-center ${color}`}>
        <svg viewBox="0 0 200 240" className="h-full w-full">
          <path d="M40 130 Q100 60 160 130 L160 155 L40 155 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          <path d="M30 155 Q100 175 170 155 L170 165 Q100 185 30 165 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          <g transform="translate(100,120)" className={text}>
            <text textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="3" fill="currentColor">KICKOFF</text>
          </g>
        </svg>
      </div>
      <div className="flex items-center justify-between p-5">
        <p className="text-sm text-white">{name}</p>
        <p className="font-mono text-xs text-[#C6FF3D]">{price}</p>
      </div>
    </div>
  );
}

function Poster() {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="relative flex aspect-[4/5] items-center justify-center bg-[#C6FF3D]">
        <div className="text-black">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em]">// n° 001</p>
          <div className="mt-4"><Wordmark className="text-6xl" /></div>
          <p className="mt-6 max-w-[180px] font-display text-2xl italic">Football, without the middlemen.</p>
        </div>
      </div>
      <div className="flex items-center justify-between p-5">
        <p className="text-sm text-white">Manifesto Poster · A2</p>
        <p className="font-mono text-xs text-[#C6FF3D]">$24</p>
      </div>
    </div>
  );
}
