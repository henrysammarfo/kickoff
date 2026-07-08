import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Apple, Monitor, Terminal, Download } from "lucide-react";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download — KICKOFF" },
      { name: "description", content: "Get the KICKOFF Pears app for macOS, Windows, or Linux." },
      { property: "og:title", content: "Download — KICKOFF" },
      { property: "og:description", content: "Runs on Pears. macOS, Windows, Linux." },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  return (
    <PageShell
      eyebrow="// install"
      title="Get KICKOFF."
      lede="KICKOFF is a Pears app for P2P match rooms, plus a local API for on-device QVAC AI and WDK wallets. Install Pear runtime once, run the local backend, then use the web UI or Pear shell."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <PlatformCard icon={Apple} name="macOS" spec="Intel · Apple Silicon" />
        <PlatformCard icon={Monitor} name="Windows" spec="10 / 11 · x64" />
        <PlatformCard icon={Terminal} name="Linux" spec="AppImage · .deb" />
      </section>

      <section className="mt-16">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
          // how it works today
        </p>
        <div className="glass max-w-2xl space-y-3 rounded-2xl p-6 text-sm text-[#A0A0A0]">
          <p>
            <strong className="text-white">Marketing site</strong> — deploy the frontend build to Vercel or Cloudflare (no QVAC on server).
          </p>
          <p>
            <strong className="text-white">Full stack</strong> — run <code className="text-white">cd api && npm run dev</code> on your machine for QVAC + WDK + P2P bootstrap.
          </p>
          <p>
            <strong className="text-white">Pear app</strong> — <code className="text-white">cd pears && pear run .</code> for native Hyperswarm rooms (Windows, macOS, Linux).
          </p>
          <p>
            <strong className="text-white">Mobile iOS/Android</strong> — Pear runtime mobile distribution is on the roadmap post-WC26; use the web UI + local API for the hackathon demo.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// or run from source</p>
        <div className="glass rounded-2xl p-6">
          <pre className="overflow-x-auto font-mono text-sm text-white">
{`# 1. install pear
npm i -g pear

# 2. verify it works
pear run pear://keet

# 3. launch KICKOFF
pear run pear://kickoff`}
          </pre>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <Step n="01" title="Pear runtime" body="Under 40 MB. Installs in seconds. Runs entirely on your machine." />
        <Step n="02" title="Model download" body="Pick Phi-3, Llama 3.2, or Mistral 7B. Downloads once, runs forever." />
        <Step n="03" title="Wallet generated" body="WDK spins you a self-custodial USDt wallet. Back up the seed. You're on." />
      </section>
    </PageShell>
  );
}

function PlatformCard({ icon: Icon, name, spec }: any) {
  return (
    <div className="glass group flex flex-col rounded-2xl p-8">
      <Icon className="h-8 w-8 text-white" strokeWidth={1.5} />
      <p className="mt-6 font-display text-3xl text-white">{name}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#A0A0A0]">{spec}</p>
      <button className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors group-hover:bg-[#C6FF3D]">
        <Download className="h-4 w-4" strokeWidth={1.75} /> Download
      </button>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">Step {n}</p>
      <h3 className="mt-4 font-display text-2xl text-white">{title}</h3>
      <p className="mt-2 text-sm text-[#A0A0A0]">{body}</p>
    </div>
  );
}
