import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { Logomark } from "@/components/brand/Logomark";
import { Bell, Trophy } from "lucide-react";

import hoodieBlack from "@/assets/merch-hoodie-black.jpg";
import hoodiePitch from "@/assets/merch-hoodie-pitch.jpg";
import teeBlack from "@/assets/merch-tee-black.jpg";
import capBlack from "@/assets/merch-cap-black.jpg";
import scarf from "@/assets/merch-scarf.jpg";
import poster from "@/assets/merch-poster.jpg";

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merch — KICKOFF · Coming Soon" },
      { name: "description", content: "Hoodies, tees, caps, and prints. The KICKOFF brand system, on your back. First drop after the WC26 final." },
      { property: "og:title", content: "Merch — KICKOFF · Coming Soon" },
      { property: "og:description", content: "The KICKOFF brand system on hoodies, tees, and caps. First drop after WC26." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/merch" },
      { property: "og:image", content: hoodieBlack },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: hoodieBlack },
    ],
    links: [{ rel: "canonical", href: "/merch" }],
  }),
  component: Merch,
});

const DROPS: {
  src: string; alt: string; name: string; price: string;
}[] = [
  { src: hoodieBlack, alt: "Black KICKOFF hoodie with serif chest print", name: "Terrace Hoodie · Black", price: "$68" },
  { src: hoodiePitch, alt: "Pitch-green KICKOFF hoodie", name: "Away Hoodie · Pitch", price: "$68" },
  { src: teeBlack, alt: "Black KICKOFF t-shirt", name: "Standard Tee · Black", price: "$32" },
  { src: capBlack, alt: "Black KICKOFF dad cap with lime embroidery", name: "Ref Cap · Pitch tab", price: "$28" },
  { src: scarf, alt: "White KICKOFF scarf with edge print", name: "Terrace Scarf · Chalk", price: "$38" },
  { src: poster, alt: "KICKOFF manifesto poster in lime", name: "Manifesto Poster · A2", price: "$24" },
];

function Merch() {
  return (
    <PageShell
      eyebrow="// wear it · drop 001"
      title="For the fans who own it."
      lede="A brand system built to hold up on merch. Single-color mark, tight wordmark, one accent. First drop lands after the WC26 final — you'll want to be on the list."
    >
      {/* Coming soon banner */}
      <div className="mb-16 grid gap-4 sm:mb-24 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="rounded-2xl border border-[#C6FF3D]/30 bg-[#C6FF3D]/[0.06] p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C6FF3D]">// drop 001 · coming soon</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-white sm:text-5xl">
            Ships after<br />the final.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#A0A0A0] sm:text-base">
            The top 100 tip senders during WC26 get first access. Everyone else joins the waitlist. WC26 is the launch — KICKOFF and its merch keep running long after.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <a
            href="mailto:drops@kickoff.football?subject=Waitlist"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C6FF3D] px-6 py-3.5 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
          >
            <Bell className="h-4 w-4" strokeWidth={1.75} />
            Join the waitlist
          </a>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
            <Trophy className="h-3 w-3" strokeWidth={1.75} />
            Top 100 tippers · first access
          </p>
        </div>
      </div>

      {/* Brand assets grid */}
      <section className="mb-20 grid gap-4 sm:mb-24 sm:grid-cols-3 sm:gap-6">
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
        <div className="mb-8 flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// the drop</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">6 pieces</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {DROPS.map((d) => (
            <ProductCard key={d.name} {...d} />
          ))}
        </div>
      </section>

      <p className="mt-16 max-w-xl text-sm text-[#A0A0A0]">
        Everything ships on 100% cotton, printed in short runs, numbered. No re-drops of the same colorway.
      </p>
    </PageShell>
  );
}

function BrandCard({ label, bg, children }: { label: string; bg: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-3 sm:p-4">
      <div className={`flex aspect-square items-center justify-center rounded-xl ${bg}`}>{children}</div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0] sm:mt-4">{label}</p>
    </div>
  );
}

function ProductCard({ src, alt, name, price }: { src: string; alt: string; name: string; price: string }) {
  return (
    <div className="glass group overflow-hidden rounded-2xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        <img
          src={src}
          alt={alt}
          width={1024}
          height={1280}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[#C6FF3D] backdrop-blur">
          Coming soon
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
        <p className="min-w-0 truncate text-sm text-white">{name}</p>
        <p className="shrink-0 font-mono text-xs text-[#C6FF3D]">{price}</p>
      </div>
    </div>
  );
}
