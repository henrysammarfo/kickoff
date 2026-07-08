import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./Sections";

export function PageShell({ children, eyebrow, title, lede }: {
  children: ReactNode; eyebrow?: string; title?: string; lede?: string;
}) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 pt-40 md:px-12">
        {(eyebrow || title || lede) && (
          <header className="mb-16 md:mb-24">
            {eyebrow && <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">{eyebrow}</p>}
            {title && (
              <h1 className="mt-6 font-display leading-[0.95] text-white" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}>
                {title}
              </h1>
            )}
            {lede && <p className="mt-6 max-w-2xl text-base text-[#A0A0A0] md:text-lg">{lede}</p>}
          </header>
        )}
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
