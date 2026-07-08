type Props = { className?: string };

export function Wordmark({ className }: Props) {
  return (
    <span className={`font-display leading-none tracking-tight ${className ?? ""}`}>
      KICKOFF
    </span>
  );
}
