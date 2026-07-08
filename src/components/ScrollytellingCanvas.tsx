import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type Manifest = { count: number; pattern: string; padLength: number };

function frameUrl(i: number, m: Manifest) {
  const n = String(i).padStart(m.padLength, "0");
  return `/frames/${m.pattern.replace("{n}", n)}`;
}

export function ScrollytellingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const lastDrawnRef = useRef(-1);
  const targetIndexRef = useRef(0);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const dprRef = useRef(1);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);

  // Load manifest
  useEffect(() => {
    fetch("/frames/manifest.json")
      .then((r) => r.json())
      .then((m: Manifest) => setManifest(m))
      .catch(() => setManifest({ count: 0, pattern: "ezgif-frame-{n}.jpg", padLength: 3 }));
  }, []);

  // Preload images
  useEffect(() => {
    if (!manifest || manifest.count === 0) {
      setReady(true);
      return;
    }
    imagesRef.current = new Array(manifest.count);
    loadedRef.current = new Array(manifest.count).fill(false);

    const eagerCount = Math.min(24, manifest.count);
    let eagerLoaded = 0;

    const loadImage = (i: number, priority: "high" | "low") =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        (img as any).fetchPriority = priority;
        img.onload = () => {
          loadedRef.current[i] = true;
          setLoadedCount((c) => c + 1);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameUrl(i + 1, manifest);
        imagesRef.current[i] = img;
      });

    // Eager: first 24
    const eagerPromises: Promise<void>[] = [];
    for (let i = 0; i < eagerCount; i++) {
      eagerPromises.push(loadImage(i, "high").then(() => { eagerLoaded++; }));
    }
    Promise.all(eagerPromises).then(() => setReady(true));

    // Stream the rest in batches of 12
    let cursor = eagerCount;
    const pump = () => {
      const end = Math.min(cursor + 12, manifest.count);
      for (let i = cursor; i < end; i++) loadImage(i, "low");
      cursor = end;
      if (cursor < manifest.count) setTimeout(pump, 0);
    };
    if (cursor < manifest.count) setTimeout(pump, 0);
  }, [manifest]);

  // Canvas sizing (DPR-aware)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      lastDrawnRef.current = -1; // force redraw
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  // rAF loop + scroll tracking + draw
  useEffect(() => {
    if (!ready || !manifest) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const target = targetIndexRef.current;
      if (target === lastDrawnRef.current) return;

      let idx = -1;
      // search backward
      for (let i = target; i >= 0; i--) {
        if (loadedRef.current[i]) { idx = i; break; }
      }
      // fallback forward
      if (idx === -1) {
        for (let i = target + 1; i < manifest.count; i++) {
          if (loadedRef.current[i]) { idx = i; break; }
        }
      }
      if (idx === -1) return;

      const img = imagesRef.current[idx];
      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;

      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2 + parallaxRef.current.x * dprRef.current;
      const dy = (ch - dh) / 2 + parallaxRef.current.y * dprRef.current;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
      lastDrawnRef.current = idx;
    };

    let rafId = 0;
    const tick = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const fraction = Math.max(0, Math.min(1, window.scrollY / scrollable));
      targetIndexRef.current = Math.min(
        manifest.count - 1,
        Math.max(0, Math.round(fraction * (manifest.count - 1)))
      );
      draw();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [ready, manifest]);

  // Desktop parallax
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mqFine.matches || mqReduced.matches) return;

    const state = parallaxRef.current;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(state, {
        x: nx * 15,
        y: ny * 15,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto",
        onUpdate: () => { lastDrawnRef.current = -1; },
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const progress = manifest && manifest.count > 0 ? Math.round((loadedCount / manifest.count) * 100) : 100;

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 bg-black" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
      {!ready && manifest && manifest.count > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#A0A0A0]">Loading</p>
            <div className="h-[2px] w-40 overflow-hidden bg-white/10">
              <div className="h-full bg-white transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
