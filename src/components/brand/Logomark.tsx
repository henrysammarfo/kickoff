type Props = { className?: string; size?: number };

export function Logomark({ className, size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="62" height="62" rx="14" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M18 14V50M18 34L38 14M18 34L44 50"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <circle cx="49" cy="19" r="3" fill="#C6FF3D" />
    </svg>
  );
}
