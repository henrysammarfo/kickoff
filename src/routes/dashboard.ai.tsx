import { createFileRoute } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useAiStatus } from "@/hooks/use-kickoff";
import { Cpu, Check, WifiOff, Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/ai")({
  component: AiPage,
});

function AiPage() {
  const { data: ai, isLoading, isError } = useAiStatus();

  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
          // qvac · on-device
        </p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">
          Local AI
        </h1>
        <p className="mt-3 text-[#A0A0A0]">
          Inference runs on your machine. No API keys. No cloud. Zero data
          leakage.
        </p>
      </div>

      {isError && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Local API offline — start the backend with{" "}
          <code className="text-amber-100">cd api && npm run dev</code>
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatBox
          label="Active model"
          value={isLoading ? "…" : (ai?.model ?? "—")}
        />
        <StatBox
          label="Mode"
          value={isLoading ? "…" : (ai?.mode ?? "—")}
          accent
        />
        <StatBox
          label="Offline capable"
          value={ai?.noCloudDependency ? "Yes" : "No"}
          icon={WifiOff}
        />
      </div>

      <div className="glass rounded-2xl p-8">
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
          Runtime status
        </p>
        <div className="grid gap-px overflow-hidden rounded-xl bg-white/10">
          <StatusRow
            label="Model ready"
            value={ai?.ready ? "Yes" : "Loading"}
            ok={ai?.ready}
            loading={isLoading}
          />
          <StatusRow
            label="Running locally"
            value={ai?.runningLocally ? "Yes" : "HTTP proxy"}
            ok={ai?.runningLocally}
          />
          <StatusRow
            label="Model ID"
            value={ai?.modelId ?? "—"}
            ok={Boolean(ai?.modelId)}
          />
          <StatusRow
            label="Cloud dependency"
            value={ai?.noCloudDependency ? "None" : "HTTP endpoint"}
            ok={ai?.noCloudDependency}
          />
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  accent?: boolean;
  icon?: ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
          {label}
        </p>
        {Icon && <Icon className="h-4 w-4 text-[#C6FF3D]" strokeWidth={1.75} />}
      </div>
      <p
        className={`mt-4 font-display text-4xl ${accent ? "text-[#C6FF3D]" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  ok,
  loading,
}: {
  label: string;
  value: string;
  ok?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="grid grid-cols-12 items-center gap-4 bg-black p-5">
      <div className="col-span-12 flex items-center gap-3 md:col-span-4">
        <Cpu className="h-4 w-4 text-white" strokeWidth={1.5} />
        <p className="text-white">{label}</p>
      </div>
      <div className="col-span-8 font-mono text-sm text-[#A0A0A0] md:col-span-6">
        {value}
      </div>
      <div className="col-span-4 md:col-span-2 md:text-right">
        {loading ? (
          <Loader2 className="ml-auto h-4 w-4 animate-spin text-[#A0A0A0]" />
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
              ok
                ? "bg-[#C6FF3D]/10 text-[#C6FF3D]"
                : "bg-white/5 text-[#A0A0A0]"
            }`}
          >
            <Check className="h-3 w-3" strokeWidth={2} />
            {ok ? "ok" : "—"}
          </span>
        )}
      </div>
    </div>
  );
}
