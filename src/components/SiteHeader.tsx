import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoLockup } from "./brand/LogoLockup";

const NAV = [
  { to: "/matches", label: "Matches" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/manifesto", label: "Manifesto" },
];

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 500 && y < 800 && y > lastY) setHidden(true);
      else if (y < lastY) setHidden(false);
      else if (y <= 500) setHidden(false);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed left-3 right-3 top-3 z-50 mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl glass px-4 py-3 transition-all duration-500 sm:left-4 sm:right-4 sm:top-4 sm:px-5 ${
          hidden && !open ? "-translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <Link to="/" className="flex min-w-0 items-center" onClick={() => setOpen(false)}>
          <LogoLockup size={22} />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0] transition-colors hover:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/dashboard"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white transition-colors hover:border-[#C6FF3D] hover:text-[#C6FF3D] sm:inline-flex"
          >
            Dashboard
          </Link>
          <Link
            to="/download"
            className="hidden rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition-colors hover:bg-[#C6FF3D] sm:inline-flex"
          >
            Get KICKOFF
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white md:hidden"
          >
            {open ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Menu className="h-4 w-4" strokeWidth={1.75} />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col px-6 pb-10 pt-24">
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-5 font-display text-4xl text-white"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-4">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/20 px-6 py-4 text-center text-sm text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/download"
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#C6FF3D] px-6 py-4 text-center text-sm font-medium text-black"
            >
              Get KICKOFF
            </Link>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
              // WC26 · P2P · self-custodial
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
