import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogoLockup } from "./brand/LogoLockup";

const NAV = [
  { to: "/matches", label: "Matches" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/merch", label: "Merch" },
  { to: "/manifesto", label: "Manifesto" },
];

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

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

  return (
    <header
      className={`fixed left-4 right-4 top-4 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-2xl glass px-5 py-3 transition-all duration-500 ${
        hidden ? "-translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <Link to="/" className="flex items-center">
        <LogoLockup size={24} />
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
      <Link
        to="/download"
        className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition-colors hover:bg-[#C6FF3D]"
      >
        Get KICKOFF
      </Link>
    </header>
  );
}
