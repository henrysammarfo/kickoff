import { createFileRoute } from "@tanstack/react-router";
import { WALLET } from "@/lib/mock-data";
import { ArrowDownLeft, ArrowUpRight, Copy, QrCode } from "lucide-react";

export const Route = createFileRoute("/dashboard/wallet")({
  component: WalletPage,
});

function WalletPage() {
  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C6FF3D]">// wdk · self-custodial</p>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">Wallet</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-8 lg:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">Balance</p>
          <p className="mt-4 font-display text-7xl text-white">{WALLET.balance.toFixed(2)}</p>
          <p className="mt-2 font-mono text-sm text-[#C6FF3D]">USDt · Tether</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-[#C6FF3D]">
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} /> Send
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white hover:bg-white/5">
              <ArrowDownLeft className="h-4 w-4" strokeWidth={1.75} /> Receive
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white hover:bg-white/5">
              <QrCode className="h-4 w-4" strokeWidth={1.75} /> QR
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">Address</p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white">
            {WALLET.address}
            <Copy className="h-3.5 w-3.5 text-[#A0A0A0]" strokeWidth={1.5} />
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">Network</p>
          <p className="mt-2 text-sm text-white">Tether Testnet · WDK</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A0A0A0]">Transactions</p>
          <button className="font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D] hover:underline">Export</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[#A0A0A0]">
              <th className="pb-3">Type</th><th className="pb-3">Detail</th><th className="pb-3">When</th><th className="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {WALLET.tx.map((t) => (
              <tr key={t.id} className="border-b border-white/5 last:border-0">
                <td className="py-4 font-mono text-[11px] uppercase tracking-widest text-[#C6FF3D]">{t.type.replace("_", " ")}</td>
                <td className="py-4 text-sm text-white">{t.note}</td>
                <td className="py-4 font-mono text-xs text-[#A0A0A0]">{t.ts}</td>
                <td className={`py-4 text-right font-mono text-sm ${t.amount > 0 ? "text-[#C6FF3D]" : "text-white"}`}>
                  {t.amount > 0 ? "+" : ""}{t.amount} USDt
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
