import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useWallet } from "@/hooks/use-kickoff";
import { ArrowDownLeft, ArrowUpRight, Copy, QrCode, Check } from "lucide-react";

export const Route = createFileRoute("/dashboard/wallet")({
  component: WalletPage,
});

function WalletPage() {
  const { data: wallet, isLoading, isError } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (!wallet?.address) return;
    await navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">
          // wdk · self-custodial
        </p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">
          Wallet
        </h1>
        <p className="mt-3 max-w-xl text-sm text-[#A0A0A0]">
          WDK generates a self-custodial wallet on this machine when the API
          starts. Each install keeps its own seed in{" "}
          <code className="text-white/80">~/.kickoff/wallet.json</code> — not
          synced across browsers automatically.
        </p>
      </div>

      {isError && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Local API offline — start the backend with{" "}
          <code className="text-amber-100">cd api && npm run dev</code>
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-8 lg:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
            Balance
          </p>
          <p className="mt-4 font-display text-7xl text-white">
            {isLoading ? "…" : (wallet?.usdt ?? 0).toFixed(2)}
          </p>
          <p className="mt-2 font-mono text-sm text-[#C6FF3D]">USDt · Tether</p>
          <p className="mt-2 font-mono text-xs text-[#A0A0A0]">
            {(wallet?.eth ?? 0).toFixed(4)} ETH (gas)
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-sm font-medium text-white/50"
              title="Use match room tip flow"
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} /> Send tip
            </button>
            <button
              type="button"
              onClick={copyAddress}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white hover:bg-white/5"
            >
              <ArrowDownLeft className="h-4 w-4" strokeWidth={1.75} /> Receive
            </button>
            <button
              type="button"
              onClick={copyAddress}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white hover:bg-white/5"
            >
              <QrCode className="h-4 w-4" strokeWidth={1.75} /> Copy
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
            Address
          </p>
          <button
            type="button"
            onClick={copyAddress}
            className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-left font-mono text-sm text-white hover:bg-white/5"
          >
            <span className="truncate">
              {isLoading ? "…" : (wallet?.address ?? "—")}
            </span>
            {copied ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-[#C6FF3D]" strokeWidth={1.5} />
            ) : (
              <Copy className="h-3.5 w-3.5 shrink-0 text-[#A0A0A0]" strokeWidth={1.5} />
            )}
          </button>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
            Network
          </p>
          <p className="mt-2 text-sm text-white">
            {wallet?.network ?? "Sepolia testnet"} · WDK
          </p>
        </div>
      </div>

      <div className="glass rounded-2xl p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">
          Transactions
        </p>
        <p className="mt-6 text-sm text-[#A0A0A0]">
          Tips and pool stakes appear here after you send them from a match room.
          Each action returns a tx hash from the local WDK wallet.
        </p>
      </div>
    </div>
  );
}
