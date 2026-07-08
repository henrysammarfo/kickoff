import { useHealth } from "@/hooks/use-kickoff";

export function ApiBanner() {
  const { isError, isLoading } = useHealth();

  if (isLoading || !isError) return null;

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center font-mono text-[11px] uppercase tracking-widest text-amber-200">
      Local API offline — run{" "}
      <code className="text-amber-100">cd api && npm run dev</code>
    </div>
  );
}
