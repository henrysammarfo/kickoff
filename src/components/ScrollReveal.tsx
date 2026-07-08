import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; as?: "div" | "h1" | "h2" | "h3" | "p" };

export function ScrollReveal({ children, className, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { setVisible(true); io.disconnect(); break; }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  // Split text children into words
  const content = typeof children === "string" ? children : null;

  if (reduced || !content) {
    const Tag = as as any;
    return <Tag ref={ref as any} className={className}>{children}</Tag>;
  }

  const words = content.split(/(\s+)/);
  const Tag = as as any;
  return (
    <Tag ref={ref as any} className={className}>
      {words.map((w, i) => (
        w.trim() === "" ? (
          <span key={i}>{w}</span>
        ) : (
          <span
            key={i}
            className="inline-block will-change-transform"
            style={{
              transition: "filter 0.7s cubic-bezier(.2,.6,.2,1), transform 0.7s cubic-bezier(.2,.6,.2,1), opacity 0.7s",
              transitionDelay: `${i * 40}ms`,
              filter: visible ? "blur(0px)" : "blur(12px)",
              transform: visible ? "translateY(0px)" : "translateY(20px)",
              opacity: visible ? 1 : 0,
            }}
          >
            {w}
          </span>
        )
      ))}
    </Tag>
  );
}
