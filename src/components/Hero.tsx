import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative grid min-h-screen grid-cols-4 gap-6 px-6 pb-16 pt-32 md:grid-cols-12 md:px-12 md:pb-24">
      <div className="col-span-4 flex items-end md:col-span-8 lg:col-span-7">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#A0A0A0]">
            <span className="h-2 w-2 rounded-full bg-[#C6FF3D]" />
            Live · World Cup 2026
          </div>
          <h1
            className="mt-6 font-display leading-[0.95] tracking-tight text-white"
            style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
          >
            Football,<br />without the<br /><em className="italic text-[#C6FF3D]">middlemen</em>.
          </h1>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-[#A0A0A0] md:text-lg">
            KICKOFF is a peer-to-peer fan platform. Local AI analyses every match on your device. Tip your friends in USDt. No servers. No custody. No permission needed.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/download"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-all hover:bg-[#C6FF3D]"
            >
              Get KICKOFF
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>
            <Link
              to="/how-it-works"
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-white underline-offset-4 hover:underline"
            >
              How it works →
            </Link>
          </div>
        </div>
      </div>
      <div className="col-span-4 hidden items-end justify-end font-mono text-[10px] uppercase tracking-[0.25em] text-[#A0A0A0] md:col-span-4 lg:col-span-5 lg:flex">
        <div className="text-right">
          <p>N° 001 · KICKOFF</p>
          <p>MetLife · Jul 19 · 2026</p>
        </div>
      </div>
    </section>
  );
}
