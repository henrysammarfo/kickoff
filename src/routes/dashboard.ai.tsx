import { createFileRoute } from "@tanstack/react-router";
import { AI_MODELS } from "@/lib/mock-data";
import { Cpu, Download, Check, WifiOff } from "lucide-react";

export const Route = createFileRoute("/dashboard/ai")({
  component: AiPage,
});

function AiPage() {
  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// qvac · on-device</p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">Local AI</h1>
        <p className="mt-3 text-[#A0A0A0]">Inference runs on your machine. No API keys. No cloud. Zero data leakage.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatBox label="Active model" value="Phi-3 Mini" />
        <StatBox label="Throughput" value="142 tok/s" accent />
        <StatBox label="Offline capable" value="Yes" icon={WifiOff} />
      </div>

      <div className="glass rounded-2xl p-8">
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">Model library</p>
        <div className="grid gap-px overflow-hidden rounded-xl bg-white/10">
          {AI_MODELS.map((m) => (
            <div key={m.id} className="grid grid-cols-12 items-center gap-4 bg-black p-5">
              <div className="col-span-12 md:col-span-4">
                <div className="flex items-center gap-3">
                  <Cpu className="h-4 w-4 text-white" strokeWidth={1.5} />
                  <div>
                    <p className="text-white">{m.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#A0A0A0]">{m.size}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-4 md:col-span-2 font-mono text-xs text-[#A0A0A0]">
                <p className="text-[9px] uppercase tracking-widest">Tokens</p>
                <p className="text-white">{m.tokens}</p>
              </div>
              <div className="col-span-4 md:col-span-2 font-mono text-xs text-[#A0A0A0]">
                <p className="text-[9px] uppercase tracking-widest">RAM</p>
                <p className="text-white">{m.ram}</p>
              </div>
              <div className="col-span-4 md:col-span-2">
                <StatusPill status={m.status} />
              </div>
              <div className="col-span-12 md:col-span-2 md:text-right">
                {m.status === "active" ? (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D]">In use</span>
                ) : m.status === "downloaded" ? (
                  <button className="rounded-full border border-white/20 px-3 py-1 text-xs text-white hover:bg-white/5">Activate</button>
                ) : (
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs text-black hover:bg-[#C6FF3D]">
                    <Download className="h-3 w-3" strokeWidth={2} /> Pull
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, accent, icon: Icon }: any) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-[#C6FF3D]" strokeWidth={1.75} />}
      </div>
      <p className={`mt-4 font-display text-4xl ${accent ? "text-[#C6FF3D]" : "text-white"}`}>{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { c: string; label: string; icon: any }> = {
    active: { c: "bg-[#C6FF3D]/10 text-[#C6FF3D]", label: "Active", icon: Check },
    downloaded: { c: "bg-white/10 text-white", label: "Downloaded", icon: Check },
    "not-downloaded": { c: "bg-white/5 text-[#A0A0A0]", label: "Not pulled", icon: Download },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${s.c}`}>
      <s.icon className="h-3 w-3" strokeWidth={2} /> {s.label}
    </span>
  );
}
