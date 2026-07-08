import { Logomark } from "./Logomark";
import { Wordmark } from "./Wordmark";

type Props = { className?: string; size?: number; stacked?: boolean; showSlash?: boolean };

export function LogoLockup({ className, size = 28, stacked = false, showSlash = true }: Props) {
  if (stacked) {
    return (
      <div className={`inline-flex flex-col items-center gap-2 ${className ?? ""}`}>
        <Logomark size={size * 1.5} />
        <Wordmark className="text-2xl" />
      </div>
    );
  }
  return (
    <div className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Logomark size={size} />
      <div className="flex items-baseline gap-1.5">
        {showSlash && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#C6FF3D]">//</span>
        )}
        <Wordmark className="text-xl" />
      </div>
    </div>
  );
}
